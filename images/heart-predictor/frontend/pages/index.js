import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [formData, setFormData] = useState({
    age: "",
    sex: "",
    cp: "",
    trestbps: "",
    chol: "",
    fbs: "",
    restecg: "",
    thalach: "",
    exang: "",
    oldpeak: "",
    slope: "",
    ca: "",
    thal: ""
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post("process.env.REACT_APP_AUTH_BACKEND_URL, formData);
      setResult(res.data);
    } catch (err) {
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">🫀 A7la madam smida</h1>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl p-6 w-full max-w-3xl grid grid-cols-2 gap-4">
        <input name="age" type="number" placeholder="Âge" value={formData.age} onChange={handleChange} required className="border p-2 rounded" />
        <select name="sex" value={formData.sex} onChange={handleChange} required className="border p-2 rounded">
          <option value="">Sexe</option>
          <option value="1">Homme</option>
          <option value="0">Femme</option>
        </select>

        <select name="cp" value={formData.cp} onChange={handleChange} required className="border p-2 rounded">
          <option value="">Type de douleur</option>
          <option value="0">Angine typique</option>
          <option value="1">Angine atypique</option>
          <option value="2">Non-anginale</option>
          <option value="3">Asymptomatique</option>
        </select>

        <input name="trestbps" type="number" placeholder="Pression artérielle au repos" value={formData.trestbps} onChange={handleChange} required className="border p-2 rounded" />
        <input name="chol" type="number" placeholder="Cholestérol" value={formData.chol} onChange={handleChange} required className="border p-2 rounded" />
        
        <select name="fbs" value={formData.fbs} onChange={handleChange} required className="border p-2 rounded">
          <option value="">Sucre à jeun &gt; 120 mg/dl</option>
          <option value="1">Oui</option>
          <option value="0">Non</option>
        </select>

        <select name="restecg" value={formData.restecg} onChange={handleChange} required className="border p-2 rounded">
          <option value="">Résultat ECG</option>
          <option value="0">Normal</option>
          <option value="1">Anomalie ST-T</option>
          <option value="2">Hypertrophie VG</option>
        </select>

        <input name="thalach" type="number" placeholder="Fréquence cardiaque max" value={formData.thalach} onChange={handleChange} required className="border p-2 rounded" />

        <select name="exang" value={formData.exang} onChange={handleChange} required className="border p-2 rounded">
          <option value="">Angine d'effort ?</option>
          <option value="1">Oui</option>
          <option value="0">Non</option>
        </select>

        <input name="oldpeak" type="number" step="0.1" placeholder="Dépression ST" value={formData.oldpeak} onChange={handleChange} required className="border p-2 rounded" />

        <select name="slope" value={formData.slope} onChange={handleChange} required className="border p-2 rounded">
          <option value="">Pente ST</option>
          <option value="0">Montante</option>
          <option value="1">Plate</option>
          <option value="2">Descendante</option>
        </select>

        <input name="ca" type="number" placeholder="Nombre de vaisseaux colorés (0-3)" value={formData.ca} onChange={handleChange} required className="border p-2 rounded" />

        <select name="thal" value={formData.thal} onChange={handleChange} required className="border p-2 rounded">
          <option value="">Thalassemia</option>
          <option value="1">Normal</option>
          <option value="2">Défaut fixe</option>
          <option value="3">Défaut réversible</option>
        </select>

        <button disabled={loading} type="submit" className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          {loading ? "Prédiction en cours..." : "Prédire"}
        </button>
      </form>

      {result && (
        <div className="mt-6 bg-white shadow p-4 rounded-xl w-full max-w-md text-center">
          {result.error ? (
            <p className="text-red-500">Erreur: {result.error}</p>
          ) : (
            <>
              <p className="text-xl font-semibold">
                Résultat :{" "}
                <span className={result.prediction === 1 ? "text-red-600" : "text-green-600"}>
                  {result.prediction === 1 ? "Risque élevé" : "Pas de risque"}
                </span>
              </p>
              <p>Probabilité: {(result.probabilities.class_1 * 100).toFixed(2)}%</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
