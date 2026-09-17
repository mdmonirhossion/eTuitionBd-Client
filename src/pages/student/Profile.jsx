import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useAxiosSecure } from '../../hooks/useAxiosSecure';
import {
  Upload,
  User,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  Plus,
  Lock,
  Unlock,
  Sliders,
  Award,
  BookOpen,
  Calendar,
  Clock,
  FileText,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
} from 'lucide-react';
import Swal from 'sweetalert2';

export const Profile = () => {
  const { user, dbUser, role, refetchDbUser } = useAuth();
  const axiosSecure = useAxiosSecure();
  const fileInputRef = useRef(null);
  const certFileInputRef = useRef(null);

  // Cloudinary credentials
  const CLOUD_NAME = 'dtqotfpgp';

  // Basic Profile State
  const [name, setName] = useState(dbUser?.name || user?.displayName || '');
  const [phone, setPhone] = useState(dbUser?.phone || '');
  const [photoURL, setPhotoURL] = useState(dbUser?.photoURL || user?.photoURL || '');
  const [bio, setBio] = useState(dbUser?.bio || '');
  const [medium, setMedium] = useState(dbUser?.medium || 'English Medium');
  const [className, setClassName] = useState(dbUser?.className || 'Class 9');
  const [subject, setSubject] = useState(dbUser?.subject || 'Mathematics');
  const [salary, setSalary] = useState(dbUser?.salary || 5000);
  const [experience, setExperience] = useState(dbUser?.experience || 2);
  const [gender, setGender] = useState(dbUser?.gender || 'Male');
  const [teachingMode, setTeachingMode] = useState(dbUser?.teachingMode || 'Online');
  const [distance, setDistance] = useState(dbUser?.distance || 5);
  const [schedules, setSchedules] = useState(dbUser?.schedules || ['4:00 PM - 6:00 PM (Evening)']);

  // Academic Profile State
  const [academics, setAcademics] = useState(dbUser?.academics || []);
  const [degree, setDegree] = useState('');
  const [institution, setInstitution] = useState('');
  const [result, setResult] = useState('');
  const [passingYear, setPassingYear] = useState('2022');
  const [certificateURL, setCertificateURL] = useState('');

  // Status & Upload State
  const [isBasicSaved, setIsBasicSaved] = useState(false);
  const [savingBasic, setSavingBasic] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingCert, setUploadingCert] = useState(false);

  useEffect(() => {
    if (dbUser) {
      setName(dbUser.name || user?.displayName || '');
      setPhone(dbUser.phone || '');
      setPhotoURL(dbUser.photoURL || user?.photoURL || '');
      setBio(dbUser.bio || '');
      setMedium(dbUser.medium || 'English Medium');
      setClassName(dbUser.className || 'Class 9');
      setSubject(dbUser.subject || 'Mathematics');
      setSalary(dbUser.salary || 5000);
      setExperience(dbUser.experience || 2);
      setGender(dbUser.gender || 'Male');
      setTeachingMode(dbUser.teachingMode || 'Online');
      setDistance(dbUser.distance || 5);
      if (dbUser.schedules && dbUser.schedules.length > 0) {
        setSchedules(dbUser.schedules);
      }
      if (dbUser.academics) {
        setAcademics(dbUser.academics);
      }
      setIsBasicSaved(true);
    }
  }, [dbUser, user]);

  // Handle Cloudinary Image Upload
  const handleCloudinaryUpload = async (file, isCertificate = false) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'unsigned_preset'); // Default unsigned preset or fallback

    if (isCertificate) setUploadingCert(true);
    else setUploadingImage(true);

    try {
      // Direct Cloudinary REST API upload
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.secure_url) {
        if (isCertificate) {
          setCertificateURL(data.secure_url);
          Swal.fire({
            icon: 'success',
            title: 'Certificate Uploaded!',
            text: 'Document uploaded to Cloudinary successfully.',
            timer: 1500,
            showConfirmButton: false,
          });
        } else {
          setPhotoURL(data.secure_url);
          Swal.fire({
            icon: 'success',
            title: 'Profile Picture Uploaded!',
            text: 'Image uploaded to Cloudinary successfully.',
            timer: 1500,
            showConfirmButton: false,
          });
        }
      } else {
        // Fallback for file reader preview if unsigned preset requires setup
        const reader = new FileReader();
        reader.onloadend = () => {
          if (isCertificate) setCertificateURL(reader.result);
          else setPhotoURL(reader.result);
        };
        reader.readAsDataURL(file);
        Swal.fire('Uploaded', 'File attached successfully.', 'success');
      }
    } catch (err) {
      console.warn('Cloudinary direct upload note:', err);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isCertificate) setCertificateURL(reader.result);
        else setPhotoURL(reader.result);
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingImage(false);
      setUploadingCert(false);
    }
  };

  // Submit Basic Profile
  const handleBasicProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingBasic(true);

    try {
      await axiosSecure.patch('/users/profile', {
        name,
        phone,
        photoURL,
        bio,
        medium,
        className,
        subject,
        salary: Number(salary),
        experience: Number(experience),
        gender,
        teachingMode,
        distance: Number(distance),
        schedules,
      });

      setIsBasicSaved(true);
      await refetchDbUser();

      Swal.fire({
        icon: 'success',
        title: '🎉 Profile Saved Successfully!',
        text: 'Your basic profile is updated. Education & Qualification sections are now unlocked.',
        confirmButtonColor: '#4f46e5',
      });
    } catch (err) {
      console.error(err);
      Swal.fire('Error', err.response?.data?.message || 'Failed to update profile.', 'error');
    } finally {
      setSavingBasic(false);
    }
  };

  // Add Academic Profile Item
  const handleAddAcademic = async (e) => {
    e.preventDefault();
    if (!degree || !institution || !result) {
      Swal.fire('Missing Information', 'Please fill in Degree, Institution, and Result.', 'warning');
      return;
    }

    const newItem = {
      id: Date.now(),
      degree,
      institution,
      result,
      passingYear,
      certificateURL,
    };

    const updatedAcademics = [...academics, newItem];

    try {
      await axiosSecure.patch('/users/profile', { academics: updatedAcademics });
      setAcademics(updatedAcademics);
      setDegree('');
      setInstitution('');
      setResult('');
      setCertificateURL('');

      Swal.fire({
        icon: 'success',
        title: 'Academic Qualification Added!',
        text: 'Your new academic record has been saved.',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to save academic profile.', 'error');
    }
  };

  const handleAddSchedulePrompt = () => {
    Swal.fire({
      title: 'Add Preferred Schedule',
      input: 'text',
      inputPlaceholder: 'e.g. 5:00 PM - 7:00 PM (Everyday)',
      showCancelButton: true,
      confirmButtonText: 'Add Slot',
      confirmButtonColor: '#4f46e5',
    }).then((res) => {
      if (res.isConfirmed && res.value) {
        setSchedules([...schedules, res.value]);
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Title Header */}
      <div>
        <h2 className="text-3xl font-extrabold font-heading text-base-content">
          {isBasicSaved ? 'Edit Profile' : 'Create Profile'}
        </h2>
        <p className="text-xs text-base-content/60 mt-1">
          Update your information to attract the right students and showcase your qualifications.
        </p>
      </div>

      {/* Basic Profile Form Container */}
      <div className="bg-base-100 dark:bg-base-200 p-8 rounded-3xl border border-base-200 dark:border-base-300 shadow-xl space-y-8">
        
        {/* Profile Picture Circle Dropzone */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <span className="text-xs font-bold text-base-content/70 uppercase tracking-wider">Profile Picture</span>
          
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative w-36 h-36 rounded-full border-2 border-dashed border-indigo-400 hover:border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all group shadow-md"
          >
            {photoURL ? (
              <img src={photoURL} alt="Profile" className="w-full h-full object-cover group-hover:opacity-80" />
            ) : (
              <div className="flex flex-col items-center text-indigo-500">
                <Upload className="w-8 h-8 mb-1" />
                <span className="text-[11px] font-bold">Upload Photo</span>
              </div>
            )}

            {uploadingImage && (
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center text-white text-xs font-bold gap-2">
                <Loader2 className="w-5 h-5 animate-spin" /> Uploading...
              </div>
            )}
          </div>

          <p className="text-[11px] text-base-content/50">Click on the image to upload a profile picture (JPG, PNG via Cloudinary)</p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleCloudinaryUpload(e.target.files[0], false)}
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* Basic Information Form */}
        <form onSubmit={handleBasicProfileSubmit} className="space-y-6">
          
          {/* Full Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-base-content/60 uppercase mb-1">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3.5 text-base-content/40" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Md Monir Hossain"
                  className="input input-bordered w-full pl-10 rounded-xl text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-base-content/60 uppercase mb-1">Phone Number *</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-base-content/40" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  required
                  className="input input-bordered w-full pl-10 rounded-xl text-sm"
                />
              </div>
            </div>
          </div>

          {/* Bio & Medium */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-base-content/60 uppercase mb-1">Bio</label>
              <textarea
                placeholder="Tell students about your teaching style and experience..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="textarea textarea-bordered w-full rounded-xl text-sm"
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-base-content/60 uppercase mb-1">Medium</label>
                <select
                  value={medium}
                  onChange={(e) => setMedium(e.target.value)}
                  className="select select-bordered w-full rounded-xl text-sm"
                >
                  <option value="English Medium">English Medium</option>
                  <option value="Bangla Medium">Bangla Medium</option>
                  <option value="English Version">English Version</option>
                  <option value="All Mediums">All Mediums</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-base-content/60 uppercase mb-1">Class / Grade</label>
                <select
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="select select-bordered w-full rounded-xl text-sm"
                >
                  <option value="Class 1-5">Class 1-5</option>
                  <option value="Class 6-8">Class 6-8</option>
                  <option value="Class 9">Class 9</option>
                  <option value="Class 10">Class 10</option>
                  <option value="SSC">SSC</option>
                  <option value="HSC">HSC</option>
                  <option value="University">University</option>
                </select>
              </div>
            </div>
          </div>

          {/* Subject & Minimum Salary Slider */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-base-content/60 uppercase mb-1">Preferred Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="select select-bordered w-full rounded-xl text-sm"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="English">English</option>
                <option value="ICT & Computer">ICT & Computer</option>
                <option value="Accounting">Accounting</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-base-content/60 uppercase">Minimum Salary</label>
                <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">{salary} BDT</span>
              </div>
              <input
                type="range"
                min="1000"
                max="50000"
                step="500"
                value={salary}
                onChange={(e) => setSalary(Number(e.target.value))}
                className="range range-indigo range-xs w-full mt-2"
              />
            </div>
          </div>

          {/* Total Experience & Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-base-content/60 uppercase mb-1">Total Experience (Years)</label>
              <input
                type="number"
                min="0"
                value={experience}
                onChange={(e) => setExperience(Number(e.target.value))}
                className="input input-bordered w-full rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-base-content/60 uppercase mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="select select-bordered w-full rounded-xl text-sm"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Teaching Mode & Distance Slider */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-base-content/60 uppercase mb-1">Teaching Mode</label>
              <select
                value={teachingMode}
                onChange={(e) => setTeachingMode(e.target.value)}
                className="select select-bordered w-full rounded-xl text-sm"
              >
                <option value="Online">Online</option>
                <option value="In-Person / Home">In-Person / Home</option>
                <option value="Both">Both Online & Home</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-base-content/60 uppercase">Travel Distance</label>
                <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">{distance} km</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                className="range range-cyan range-xs w-full mt-2"
              />
            </div>
          </div>

          {/* Availability Schedules */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-base-content/60 uppercase">Availability Schedule</label>
              <button
                type="button"
                onClick={handleAddSchedulePrompt}
                className="btn btn-xs btn-outline border-base-300 rounded-xl gap-1 text-[11px]"
              >
                <Plus className="w-3.5 h-3.5" /> Add New Schedule
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {schedules.map((sch, i) => (
                <span key={i} className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold text-xs border border-indigo-200">
                  {sch}
                </span>
              ))}
            </div>
          </div>

          {/* Blue Notice Banner & Create Profile Button */}
          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="font-bold text-indigo-600 dark:text-indigo-400 text-xs flex items-center gap-1">
                ↑ Save your basic profile first
              </span>
              <p className="text-[11px] text-base-content/60">
                Fill in the details above and save — the Education & Qualification sections will unlock automatically.
              </p>
            </div>
            <button
              type="submit"
              disabled={savingBasic}
              className="btn bg-indigo-600 hover:bg-indigo-700 text-white border-none rounded-xl font-bold text-xs gap-2 px-6 shadow-md shrink-0 w-full sm:w-auto"
            >
              <Save className="w-4 h-4" />
              {savingBasic ? 'Saving...' : isBasicSaved ? 'Update Profile' : 'Create Profile'}
            </button>
          </div>

        </form>

      </div>

      {/* Add New Academic Profile Section */}
      <div className={`bg-base-100 dark:bg-base-200 p-8 rounded-3xl border border-base-200 dark:border-base-300 shadow-xl space-y-6 relative ${
        !isBasicSaved ? 'opacity-60 pointer-events-none' : ''
      }`}>
        
        {!isBasicSaved && (
          <div className="absolute inset-0 z-20 bg-base-100/80 backdrop-blur-xs rounded-3xl flex flex-col items-center justify-center p-6 text-center space-y-2">
            <Lock className="w-8 h-8 text-amber-500" />
            <h4 className="font-bold text-base text-base-content">Save Profile to Unlock Academic Sections</h4>
            <p className="text-xs text-base-content/60 max-w-sm">
              Please complete and click "Create Profile" above to add your academic degrees and certificates.
            </p>
          </div>
        )}

        <div>
          <h3 className="text-xl font-bold font-heading text-base-content">Add New Academic Profile</h3>
          <p className="text-xs text-base-content/60">Your academic qualifications and degree certificates.</p>
        </div>

        {/* Existing Academics List */}
        {academics.length > 0 && (
          <div className="space-y-3">
            {academics.map((item) => (
              <div key={item.id || item._id} className="p-4 rounded-2xl bg-base-200/60 border border-base-300 flex items-center justify-between text-xs">
                <div>
                  <h5 className="font-bold text-sm text-base-content">{item.degree} — {item.institution}</h5>
                  <p className="text-base-content/60">Result: {item.result} | Passing Year: {item.passingYear}</p>
                  {item.certificateURL && (
                    <a href={item.certificateURL} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-semibold block mt-1">
                      📄 View Certificate Document
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Academic Form */}
        <form onSubmit={handleAddAcademic} className="p-6 rounded-2xl bg-base-200/40 border border-base-300 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-base-content/60 block mb-2">
            ADD NEW ACADEMIC PROFILE
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-base-content/60 uppercase mb-1">Degree *</label>
              <input
                type="text"
                placeholder="e.g. SSC, HSC, BSc in CSE"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                required
                className="input input-sm input-bordered w-full rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-base-content/60 uppercase mb-1">Institution *</label>
              <input
                type="text"
                placeholder="Institution Name"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                required
                className="input input-sm input-bordered w-full rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-base-content/60 uppercase mb-1">Result *</label>
              <input
                type="text"
                placeholder="e.g. GPA 5.0 / 3.85"
                value={result}
                onChange={(e) => setResult(e.target.value)}
                required
                className="input input-sm input-bordered w-full rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-base-content/60 uppercase mb-1">Passing Year *</label>
              <select
                value={passingYear}
                onChange={(e) => setPassingYear(e.target.value)}
                className="select select-sm select-bordered w-full rounded-xl text-xs"
              >
                {Array.from({ length: 25 }, (_, i) => 2025 - i).map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Certificate Document Cloudinary Upload */}
          <div>
            <label className="block text-[11px] font-bold text-base-content/60 uppercase mb-1">Certificate Document</label>
            <div
              onClick={() => certFileInputRef.current?.click()}
              className="p-4 rounded-xl border-2 border-dashed border-base-300 hover:border-indigo-500 bg-base-100 flex flex-col items-center justify-center cursor-pointer text-xs space-y-1 transition-all"
            >
              <Upload className="w-5 h-5 text-indigo-500" />
              <span className="font-semibold text-base-content/70">
                {uploadingCert ? 'Uploading to Cloudinary...' : certificateURL ? 'Document Attached! Click to change' : 'Upload Document (PDF / Image via Cloudinary)'}
              </span>
            </div>
            <input
              type="file"
              ref={certFileInputRef}
              onChange={(e) => handleCloudinaryUpload(e.target.files[0], true)}
              className="hidden"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="btn btn-sm bg-indigo-600 hover:bg-indigo-700 text-white border-none rounded-xl font-bold text-xs gap-1.5 px-6 shadow-md"
            >
              <Plus className="w-4 h-4" /> Save & Add Another
            </button>
          </div>
        </form>

      </div>

    </div>
  );
};
