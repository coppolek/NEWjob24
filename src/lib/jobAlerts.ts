export async function checkNewJobsMatchingPreferences(keyword: string, location: string) {
  if (!keyword && !location) return [];

  try {
    const response = await fetch('/api/careerjet/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      // Search sorted by date to get the newest ones
      body: JSON.stringify({ 
        keywords: keyword, 
        location: location,
        sort: 'date' 
      })
    });

    if (!response.ok) {
      throw new Error('Errore nella comunicazione con il server');
    }

    const data = await response.json();
    
    // Check if the API returned an error type
    if (data.type === 'ERROR') {
      throw new Error(data.error || 'Errore restituito dall\'API di Careerjet');
    }

    // Return the first few matching jobs as an "alert" preview
    return (data.jobs || []).slice(0, 5);
  } catch (error) {
    console.error("Error checking new jobs:", error);
    return [];
  }
}
