import React, { useState, useEffect } from 'react';
import './App.css';
import ConceptSelection from './components/ConceptSelection';
import RecommendationDisplay from './components/RecommendationDisplay';
import { fetchLectures, getRecommendations } from './api'; // Import API functions

interface Concept {
  id: string;
  title: string;
}

function App() {
  const [availableConcepts, setAvailableConcepts] = useState<Concept[]>([]);
  const [knownConcepts, setKnownConcepts] = useState<string[]>([]);
  const [targetConcept, setTargetConcept] = useState<string>('');
  const [recommendedPath, setRecommendedPath] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConcepts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchLectures();
        // Assuming lectures.json titles are your concepts for selection
        const concepts = data.map((lecture: any) => ({ id: lecture.id, title: lecture.title }));
        setAvailableConcepts(concepts);
      } catch (err) {
        console.error("Failed to fetch lectures:", err);
        setError("Failed to load available concepts.");
      } finally {
        setLoading(false);
      }
    };
    loadConcepts();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setRecommendedPath([]); // Clear previous recommendations
    try {
      // IMPORTANT: This call assumes Member 3 has implemented the /recommend endpoint
      // The `getRecommendations` function (defined in `api.ts`) will send the data.
      const recommendations = await getRecommendations(knownConcepts, targetConcept);
      setRecommendedPath(recommendations.recommended_concepts);
    } catch (err) {
      console.error("Failed to get recommendations:", err);
      setError("Failed to generate recommendations. Please check your inputs and ensure the backend is running and the /recommend endpoint is implemented.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Personalized Learning Path Recommendation</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      <ConceptSelection
        availableConcepts={availableConcepts.map(c => c.title)} // Pass only titles for selection
        knownConcepts={knownConcepts}
        setKnownConcepts={setKnownConcepts}
        targetConcept={targetConcept}
        setTargetConcept={setTargetConcept}
        onSubmit={handleSubmit}
      />

      {recommendedPath.length > 0 && (
        <RecommendationDisplay recommendedPath={recommendedPath} />
      )}
    </div>
  );
}

export default App;