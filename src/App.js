import React, { useState, useRef } from 'react';
import Tesseract from 'tesseract.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Printer, Share2, Copy, Mail, MessageSquare, Upload, Loader2, User, Stethoscope, Calendar } from 'lucide-react';

const App = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    purpose: '',
    name: '',
    age: '',
    sex: '',
    symptoms: '',
    diagnosis: '',
    startDate: '',
    endDate: '',
    body: 'Fit to resume duties.'
  });

  const certificateRef = useRef();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const { data: { text } } = await Tesseract.recognize(file, 'eng');
      setFormData(prev => ({ ...prev, body: text }));
    } catch (error) {
      alert("Error reading image. Please enter details manually.");
    }
    setLoading(false);
  };

  const downloadPDF = async () => {
    const element = certificateRef.current;
    // We use a high scale for print quality
    const canvas = await html2canvas(element, { 
      scale: 3, 
      useCORS: true,
      logging: false 
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
    pdf.save(`Medical_Certificate_${formData.name || 'EMC'}.pdf`);
  };

  const shareWhatsApp = () => {
    const text = `*Medical Certificate*\n*Patient:* ${formData.name}\n*Diagnosis:* ${formData.diagnosis}\n*Period:* ${formData.startDate} to ${formData.endDate}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        
        {/* LEFT COLUMN: EDITOR */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200">
          <div className="flex items-center gap-3 mb-6 border-b pb-4">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Stethoscope className="text-white" size={24} />
            </div>
            <h2 className="text-2xl font-bold">Certificate Editor</h2>
          </div>
          
          <div className="space-y-5">
            {/* OCR Upload */}
            <div className="relative group">
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-blue-200 rounded-xl bg-blue-50/50 p-4 cursor-pointer hover:bg-blue-50 transition-colors">
                {loading ? (
                  <Loader2 className="animate-spin text-blue-600 mb-2" />
                ) : (
                  <Upload className="text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                )}
                <span className="text-sm font-semibold text-blue-700">Upload Prescription for AI Extract</span>
                <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
              </label>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Name</label>
                <input name="name" placeholder="Naman..." onChange={handleChange} className="input-style" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Age</label>
                <input name="age" type="number" placeholder="Age" onChange={handleChange} className="input-style" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Sex</label>
                <select name="sex" onChange={handleChange} className="input-style">
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Purpose</label>
                <input name="purpose" placeholder="e.g. Medical Leave" onChange={handleChange} className="input-style" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Symptoms</label>
                <textarea name="symptoms" onChange={handleChange} className="input-style h-16" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Diagnosis</label>
                <textarea name="diagnosis" onChange={handleChange} className="input-style h-16" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Rest From</label>
                <input type="date" name="startDate" onChange={handleChange} className="input-style" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Until</label>
                <input type="date" name="endDate" onChange={handleChange} className="input-style" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Medical Advice / Body</label>
              <textarea name="body" value={formData.body} onChange={handleChange} className="input-style h-24" />
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
              <button onClick={downloadPDF} className="btn-primary bg-blue-700"><Printer size={18}/> PDF</button>
              <button onClick={shareWhatsApp} className="btn-primary bg-green-600"><MessageSquare size={18}/> WhatsApp</button>
              <button onClick={() => window.print()} className="btn-primary bg-slate-700"><Share2 size={18}/> Print</button>
              <button onClick={() => navigator.clipboard.writeText(formData.body)} className="btn-primary bg-slate-400"><Copy size={18}/> Copy</button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PREVIEW */}
        <div className="preview-section">
          <div className="preview-container">
            <div ref={certificateRef} className="certificate-page">
              {/* Background Image: Object-fill ensures it hits corners */}
              <img src="/letterhead.png" className="letterhead-bg" alt="Letterhead" />
              
              {/* Content Overlay */}
              <div className="certificate-content-layer">
                <h1 className="certificate-title">MEDICAL CERTIFICATE</h1>
                
                <div className="certificate-body text-justify">
                  <p>To Whom It May Concern,</p>
                  
                  <p>
                    This is to certify that <span className="field-value">{formData.name || "________________"}</span>, 
                    aged <span className="field-value">{formData.age || "___"}</span> years, <span className="field-value">{formData.sex || "________"}</span>, 
                    was under my medical supervision for the purpose of <span className="field-value">{formData.purpose || "medical consultation"}</span>.
                  </p>

                  <div className="diagnosis-box">
                    <p><strong>Presenting Symptoms:</strong> {formData.symptoms || "N/A"}</p>
                    <p><strong>Clinical Diagnosis:</strong> {formData.diagnosis || "N/A"}</p>
                  </div>

                  <p>
                    Based on the clinical examination, the patient is/was advised rest and medical leave from 
                    <span className="field-value"> {formData.startDate || "_________"} </span> to 
                    <span className="field-value"> {formData.endDate || "_________"}</span>.
                  </p>

                  <div className="mt-4 italic min-h-[60px]">
                    {formData.body}
                  </div>
                </div>

                {/* Signature Row - Automatically pushed to bottom of safe area */}
                <div className="certificate-footer">
                  <div className="text-sm">
                    <p>Date: {new Date().toLocaleDateString()}</p>
                    <p>Place: Dwarka, Delhi</p>
                  </div>
                  <div className="signature-line">
                    <div className="h-12"></div>
                    <p className="font-bold border-t border-slate-900 pt-1">Authorized Signatory</p>
                    <p className="text-[10pt] uppercase tracking-tighter">Easy My Care (EMC)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;
