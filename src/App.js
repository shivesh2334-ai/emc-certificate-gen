import React, { useState, useRef } from 'react';
import Tesseract from 'tesseract.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Printer, Share2, Copy, Mail, MessageSquare, Upload, Loader2 } from 'lucide-react';

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
    body: ''
  });

  const certificateRef = useRef();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // OCR Processing
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const { data: { text } } = await Tesseract.recognize(file, 'eng');
      // Update body with extracted text
      setFormData(prev => ({ ...prev, body: text }));
      alert("Text extracted successfully!");
    } catch (error) {
      console.error("OCR Error:", error);
    }
    setLoading(false);
  };

  // Export to PDF
  const downloadPDF = async () => {
    const element = certificateRef.current;
    const canvas = await html2canvas(element, { scale: 3, useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
    pdf.save(`Certificate_${formData.name || 'Patient'}.pdf`);
  };

  const shareWhatsApp = () => {
    const text = `Medical Certificate for ${formData.name}\nDiagnosis: ${formData.diagnosis}\nPeriod: ${formData.startDate} to ${formData.endDate}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareEmail = () => {
    const subject = `Medical Certificate - ${formData.name}`;
    const body = `Please find the medical details for ${formData.name}. Diagnosis: ${formData.diagnosis}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Input Panel */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Certificate Details</h2>
          
          <div className="space-y-4">
            <div className="p-4 border-2 border-dashed border-blue-200 rounded-lg bg-blue-50">
              <label className="flex flex-col items-center cursor-pointer">
                {loading ? <Loader2 className="animate-spin text-blue-600" /> : <Upload className="text-blue-600" />}
                <span className="text-sm font-medium mt-2">Upload Prescription for OCR</span>
                <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="name" placeholder="Patient Name" onChange={handleChange} className="input-style" />
              <input name="purpose" placeholder="Purpose of Certificate" onChange={handleChange} className="input-style" />
              <input name="age" placeholder="Age" onChange={handleChange} className="input-style" />
              <select name="sex" onChange={handleChange} className="input-style">
                <option value="">Select Sex</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <textarea name="symptoms" placeholder="Symptoms" onChange={handleChange} className="input-style h-20" />
            <textarea name="diagnosis" placeholder="Diagnosis" onChange={handleChange} className="input-style h-20" />
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-xs text-slate-500 ml-1">From Date</label>
                <input type="date" name="startDate" onChange={handleChange} className="input-style" />
              </div>
              <div className="flex flex-col">
                <label className="text-xs text-slate-500 ml-1">To Date</label>
                <input type="date" name="endDate" onChange={handleChange} className="input-style" />
              </div>
            </div>

            <textarea name="body" value={formData.body} placeholder="Additional medical advice or body text..." onChange={handleChange} className="input-style h-32" />

            <div className="flex flex-wrap gap-3 pt-4">
              <button onClick={downloadPDF} className="btn-primary bg-blue-700"><Printer size={18}/> Print / PDF</button>
              <button onClick={shareWhatsApp} className="btn-primary bg-green-600"><MessageSquare size={18}/> WhatsApp</button>
              <button onClick={shareEmail} className="btn-primary bg-slate-600"><Mail size={18}/> Email</button>
              <button onClick={() => navigator.clipboard.writeText(formData.body)} className="btn-primary bg-slate-400"><Copy size={18}/> Copy</button>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
<div className="overflow-auto bg-slate-200 p-4 rounded-xl flex justify-center border-l border-slate-300">
  <div 
    ref={certificateRef}
    className="certificate-container"
  >
    {/* High-quality background image covering exactly the A4 area */}
    <img 
      src="/letterhead.png" 
      className="absolute inset-0 w-full h-full object-fill z-0" 
      alt="Letterhead" 
    />
    
    {/* Content Area - Tuned for your specific letterhead proportions */}
    <div className="relative z-10 px-[25mm] pt-[55mm] pb-[60mm] h-full flex flex-col text-slate-900 font-serif">
      <h1 className="text-center text-3xl font-bold underline mb-10 tracking-wide">
        MEDICAL CERTIFICATE
      </h1>
      
      <div className="flex-grow space-y-8 text-[13pt] leading-[1.8]">
        <p className="font-semibold">To Whom It May Concern,</p>
        
        <p>
          This is to certify that <strong>{formData.name || "__________"}</strong>, 
          aged <strong>{formData.age || "___"}</strong> years, <strong>{formData.sex || "___"}</strong>, 
          was under my medical supervision for the purpose of <strong>{formData.purpose || "medical consultation"}</strong>.
        </p>

        <div className="space-y-4 py-2 border-l-4 border-slate-200 pl-6 italic">
          <p><strong>Presenting Symptoms:</strong> {formData.symptoms || "N/A"}</p>
          <p><strong>Clinical Diagnosis:</strong> {formData.diagnosis || "N/A"}</p>
        </div>

        <p>
          Based on the clinical examination, the patient is/was advised rest and medical leave from 
          <span className="border-b border-slate-400 mx-1 px-2 font-bold">{formData.startDate || "___"}</span> 
          to 
          <span className="border-b border-slate-400 mx-1 px-2 font-bold">{formData.endDate || "___"}</span>.
        </p>

        <div className="whitespace-pre-wrap mt-6 min-h-[80px]">
          {formData.body}
        </div>
      </div>

      {/* Signature area placed above the footer info */}
      <div className="mt-auto flex justify-between items-end">
        <div className="text-sm opacity-70">
          <p>Date: {new Date().toLocaleDateString()}</p>
          <p>Place: Dwarka, Delhi</p>
        </div>
        <div className="text-center w-56">
          <div className="h-16"></div> {/* Space for manual stamp/sign */}
          <p className="border-t border-slate-800 pt-1 font-bold">Authorized Signatory</p>
          <p className="text-xs font-sans tracking-tighter">Easy My Care (EMC) Private Limited</p>
        </div>
      </div>
    </div>
  </div>
</div>
