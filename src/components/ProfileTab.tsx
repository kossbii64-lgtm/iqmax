import {
  CheckCircle2,
  Edit3,
  FileText,
  LogOut,
  MapPin,
  PackageCheck,
  Phone,
  Save,
  ShieldCheck,
  User,
} from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { MALAYSIAN_STATES } from '../config/storeConfig';
import type { PolicyKey, UserProfile } from '../types/store';
import { inferRegionFromState } from '../utils/storeLogic';

interface ProfileTabProps {
  userProfile: UserProfile;
  ordersCount: number;
  onSaveProfile: (updated: UserProfile) => void;
  onGoToOrders: () => void;
  onOpenPolicy: (key: PolicyKey) => void;
  onRequestLogout: () => void;
}

export function ProfileTab({
  userProfile,
  ordersCount,
  onSaveProfile,
  onGoToOrders,
  onOpenPolicy,
  onRequestLogout,
}: ProfileTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(userProfile.fullName);
  const [phoneNumber, setPhoneNumber] = useState(userProfile.phoneNumber);
  const [address, setAddress] = useState(userProfile.address);
  const [city, setCity] = useState(userProfile.city);
  const [state, setState] = useState(userProfile.state);
  const [postcode, setPostcode] = useState(userProfile.postcode);
  const [savedNotice, setSavedNotice] = useState(false);
  const [formError, setFormError] = useState('');

  const startEditing = () => {
    setFullName(userProfile.fullName);
    setPhoneNumber(userProfile.phoneNumber);
    setAddress(userProfile.address);
    setCity(userProfile.city);
    setState(userProfile.state);
    setPostcode(userProfile.postcode);
    setFormError('');
    setSavedNotice(false);
    setIsEditing(true);
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || fullName.trim().length < 2) {
      setFormError('Full name must be at least 2 characters.');
      return;
    }
    setFormError('');
    const nextRegion = state ? inferRegionFromState(state) : userProfile.defaultRegion;
    onSaveProfile({
      ...userProfile,
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      postcode: postcode.trim(),
      defaultRegion: nextRegion,
    });
    setIsEditing(false);
    setSavedNotice(true);
  };

  const formattedAddress = [
    userProfile.address,
    [userProfile.postcode, userProfile.city].filter(Boolean).join(' '),
    userProfile.state,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <div data-testid="profile-tab" className="space-y-6 max-w-4xl mx-auto">
      {/* Top Profile Banner */}
      <section className="rounded-3xl bg-[#164A91] text-white p-6 sm:p-7 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#F5A623] text-[#0F1E36] flex items-center justify-center shrink-0">
            <User className="w-7 h-7" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                data-testid="profile-demo-indicator"
                className="px-2.5 py-0.5 rounded bg-white/15 border border-white/25 font-mono text-[10px] font-extrabold tracking-wider text-[#F5A623]"
              >
                {userProfile.isDemoAccount ? 'DEMO ACCOUNT' : 'LOCAL ACCOUNT (DEMO)'}
              </span>
              <span className="font-mono text-[11px] text-blue-200">{userProfile.userId}</span>
            </div>
            <h1
              data-testid="profile-display-name"
              className="font-display font-extrabold text-xl sm:text-2xl tracking-tight"
            >
              {userProfile.fullName}
            </h1>
            <p className="text-xs sm:text-sm text-blue-100">{userProfile.email}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onRequestLogout}
          data-testid="profile-logout-button"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-red-600 text-white font-display font-bold text-xs sm:text-sm transition-colors cursor-pointer self-start sm:self-auto min-h-[42px]"
        >
          <LogOut className="w-4 h-4" aria-hidden="true" />
          <span>Log Out</span>
        </button>
      </section>

      {savedNotice && (
        <div
          data-testid="profile-saved-notice"
          className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 flex items-center gap-2.5 text-xs sm:text-sm font-medium text-emerald-800"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Profile saved locally in browser storage (DEMO).</span>
        </div>
      )}

      {/* Profile Details or Edit Form */}
      <section className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 space-y-5">
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h2 className="font-display font-bold text-lg text-[#0F1E36]">
              Account &amp; Delivery Information
            </h2>
            <p className="text-xs text-slate-500">
              Used to auto-fill your Checkout delivery details.
            </p>
          </div>
          {!isEditing && (
            <button
              type="button"
              onClick={startEditing}
              data-testid="edit-profile-button"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#EBF2FC] hover:bg-[#dce8f9] text-[#164A91] font-display font-bold text-xs cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="profile-edit-name"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  id="profile-edit-name"
                  data-testid="profile-edit-name-input"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#164A91]"
                />
              </div>

              <div>
                <label
                  htmlFor="profile-edit-phone"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Phone Number
                </label>
                <input
                  id="profile-edit-phone"
                  data-testid="profile-edit-phone-input"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g. 0123456789"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#164A91]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="profile-edit-address"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Delivery Street / Unit Address
              </label>
              <textarea
                id="profile-edit-address"
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House / Unit No, Street, Taman"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#164A91]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="profile-edit-city"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  City
                </label>
                <input
                  id="profile-edit-city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Shah Alam"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#164A91]"
                />
              </div>

              <div>
                <label
                  htmlFor="profile-edit-state"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  State
                </label>
                <select
                  id="profile-edit-state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#164A91]"
                >
                  <option value="">Select state</option>
                  {MALAYSIAN_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="profile-edit-postcode"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Postcode
                </label>
                <input
                  id="profile-edit-postcode"
                  type="text"
                  maxLength={5}
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  placeholder="40000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#164A91]"
                />
              </div>
            </div>

            {formError && (
              <p role="alert" className="text-xs font-medium text-red-600">
                {formError}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="submit"
                data-testid="save-profile-button"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F5A623] hover:bg-[#D98B0F] text-[#0F1E36] font-display font-extrabold text-sm cursor-pointer"
              >
                <Save className="w-4 h-4" aria-hidden="true" />
                <span>Save Profile</span>
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-display font-semibold text-sm hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="rounded-xl bg-[#F6F8FB] p-4 border border-slate-200/80">
              <dt className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                <User className="w-3.5 h-3.5 text-[#164A91]" aria-hidden="true" />
                <span>Full Name &amp; Email</span>
              </dt>
              <dd className="mt-1.5 font-semibold text-[#0F1E36]">{userProfile.fullName}</dd>
              <dd className="text-xs text-slate-600">{userProfile.email}</dd>
            </div>

            <div className="rounded-xl bg-[#F6F8FB] p-4 border border-slate-200/80">
              <dt className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                <Phone className="w-3.5 h-3.5 text-[#164A91]" aria-hidden="true" />
                <span>Phone Number</span>
              </dt>
              <dd className="mt-1.5 font-mono font-semibold text-[#0F1E36]">
                {userProfile.phoneNumber || 'Not set yet — tap Edit Profile'}
              </dd>
            </div>

            <div className="sm:col-span-2 rounded-xl bg-[#F6F8FB] p-4 border border-slate-200/80">
              <dt className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-[#164A91]" aria-hidden="true" />
                <span>Saved Delivery Address</span>
              </dt>
              <dd className="mt-1.5 text-[#0F1E36] leading-relaxed">
                {formattedAddress || 'No saved address yet — tap Edit Profile to add one.'}
              </dd>
            </div>
          </dl>
        )}
      </section>

      {/* Quick Actions & Demo Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={onGoToOrders}
          className="rounded-2xl bg-white p-5 border border-slate-200 hover:border-[#164A91] text-left flex items-center justify-between gap-4 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#EBF2FC] text-[#164A91] flex items-center justify-center shrink-0">
              <PackageCheck className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <p className="font-display font-bold text-sm text-[#0F1E36]">My Orders</p>
              <p className="text-xs text-slate-500">
                View {ordersCount} {ordersCount === 1 ? 'DEMO order' : 'DEMO orders'}
              </p>
            </div>
          </div>
          <span className="font-mono text-xs font-bold text-[#164A91]">Open &rarr;</span>
        </button>

        <div className="rounded-2xl bg-white p-5 border border-slate-200 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#164A91]">
            <ShieldCheck className="w-4 h-4 text-[#F5A623]" aria-hidden="true" />
            <span>Demo Prototype Notices</span>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              type="button"
              onClick={() => onOpenPolicy('shipping')}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#F6F8FB] hover:bg-slate-200/60 text-slate-700 font-medium cursor-pointer"
            >
              <FileText className="w-3 h-3" aria-hidden="true" />
              <span>Shipping Guide</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenPolicy('terms')}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#F6F8FB] hover:bg-slate-200/60 text-slate-700 font-medium cursor-pointer"
            >
              <FileText className="w-3 h-3" aria-hidden="true" />
              <span>Terms &amp; Supplement</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenPolicy('privacy')}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#F6F8FB] hover:bg-slate-200/60 text-slate-700 font-medium cursor-pointer"
            >
              <FileText className="w-3 h-3" aria-hidden="true" />
              <span>Demo Privacy</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
