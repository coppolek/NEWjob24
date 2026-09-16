import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Save user to firestore
        try {
          await setDoc(doc(db, 'users', currentUser.uid), {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            createdAt: new Date()
          }, { merge: true });
        } catch (error) {
          console.error("Error saving user to DB", error);
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async () => {
    if (isSigningIn) return;
    
    setIsSigningIn(true);
    setError(null);
    
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error("Error signing in", err);
      if (err.code === 'auth/popup-blocked') {
        setError("Il popup di accesso è stato bloccato dal browser. Usa il pulsante 'Open in New Tab' in alto a destra per usare l'app a schermo intero, oppure consenti i popup.");
      } else if (err.code === 'auth/cancelled-popup-request' || err.code === 'auth/popup-closed-by-user') {
        // User closed or cancelled the popup, ignore.
      } else {
        setError(`Errore di accesso: ${err.message}`);
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{ user, loading, error, signIn, signOut, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
