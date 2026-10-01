import { useEffect, useState } from 'react';
import api, { errMsg } from '../api.js';

export default function Images() {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = () => api.get('/images').then((r) => setImages(r.data)).catch((e) => setError(errMsg(e)));
  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!file) return setPreview('');
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const onPick = (e) => {
    setError('');
    const f = e.target.files[0];
    if (!f) return setFile(null);
    if (!f.type.startsWith('image/')) { setFile(null); return setError('Please select an image file'); }
    if (f.size > 2 * 1024 * 1024) { setFile(null); return setError('Image must be 2MB or smaller'); }
    setFile(f);
  };

  const upload = async () => {
    if (!file) return setError('Choose an image first');
    const fd = new FormData();
    fd.append('image', file);
    setBusy(true);
    try {
      await api.post('/images', fd);
      setFile(null);
      document.getElementById('file').value = '';
      load();
    } catch (e) { setError(errMsg(e)); }
    finally { setBusy(false); }
  };

  const remove = async (id) => {
    try { await api.delete(`/images/${id}`); load(); }
    catch (e) { setError(errMsg(e)); }
  };

  return (
    <>
      <div className="card">
        <h2>Upload image</h2>
        {error && <p className="error banner">{error}</p>}
        <input id="file" type="file" accept="image/*" onChange={onPick} />
        {preview && <img className="preview" src={preview} alt="Preview" />}
        <button className="btn" onClick={upload} disabled={busy || !file}>{busy ? 'Uploading…' : 'Upload'}</button>
      </div>

      <div className="card">
        <h2>Uploaded images</h2>
        {images.length === 0 ? <p className="muted">Nothing uploaded yet.</p> : (
          <div className="grid">
            {images.map((img) => (
              <figure key={img._id}>
                <img src={img.url} alt={img.originalName} />
                <figcaption>
                  <span className="muted">{img.originalName}</span>
                  <button className="btn small danger" onClick={() => remove(img._id)}>Delete</button>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
