'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  BookOpenText,
  BrainCircuit,
  ImagePlus,
  LayoutDashboard,
  MapPin,
  ShieldCheck,
  Workflow,
} from 'lucide-react';
import RoleDashboardLayout from '@/Components/RoleDashboardLayout';
import NGODashboard from '@/Components/ngo/NGODashboard';
import DriveForm from '@/Components/ngo/DriveForm';
import DriveList from '@/Components/ngo/DriveList';
import BlogEditor from '@/Components/ngo/BlogEditor';
import BlogList from '@/Components/ngo/BlogList';
import ImageUploader from '@/Components/ngo/ImageUploader';
import ModelDecisionPreview from '@/Components/ngo/ModelDecisionPreview';
import VillageDecisionCard from '@/Components/ngo/VillageDecisionCard';
import { supabase } from '@/lib/supabase';

const navItems = [
  { href: '#overview', label: 'Overview', icon: LayoutDashboard },
  { href: '#dashboard', label: 'Dashboard', icon: Workflow },
  { href: '#drives', label: 'Drives', icon: ShieldCheck },
  { href: '#decisions', label: 'AI Reports', icon: BrainCircuit },
  { href: '#media', label: 'Media', icon: ImagePlus },
  { href: '#blogs', label: 'Blogs', icon: BookOpenText },
];

const fallbackLogo =
  'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=1200&q=80';

function formatDate(value) {
  if (!value) {
    return 'No date';
  }

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
  }).format(new Date(value));
}

function normalizeEmail(value) {
  return (value || '').trim().toLowerCase();
}

function NgoSummaryCard({ ngo }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-teal-100 bg-white shadow-xl">
      <div className="relative h-48 overflow-hidden">
        <img
          src={ngo.logo_url || fallbackLogo}
          alt={ngo.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-teal-950/70 to-transparent" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-teal-800 shadow-sm">
            {ngo.location}
          </span>
          {ngo.verified && (
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700 shadow-sm">
              Verified
            </span>
          )}
        </div>
      </div>

      <div className="space-y-4 p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">
            Active NGO
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-teal-950">{ngo.name}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">{ngo.description}</p>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-teal-100 bg-teal-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Total Drives
            </p>
            <p className="mt-2 text-3xl font-extrabold text-teal-950">
              {ngo.total_drives || 0}
            </p>
          </div>
          <div className="rounded-2xl border border-teal-100 bg-teal-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Success Score
            </p>
            <p className="mt-2 text-3xl font-extrabold text-teal-950">
              {ngo.success_score || 0}
            </p>
          </div>
          <div className="rounded-2xl border border-teal-100 bg-teal-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Contact
            </p>
            <p className="mt-2 text-sm font-semibold text-teal-950">
              {ngo.contact_email || 'No email'}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function NgosPage() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [ngos, setNgos] = useState([]);
  const [activeNgo, setActiveNgo] = useState(null);
  const [drives, setDrives] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [images, setImages] = useState([]);
  const [connectedDoctors, setConnectedDoctors] = useState([]);
  const [connectedDonors, setConnectedDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [driveEditorRecord, setDriveEditorRecord] = useState(null);
  const [blogEditorRecord, setBlogEditorRecord] = useState(null);
  const [driveSubmitting, setDriveSubmitting] = useState(false);
  const [blogSubmitting, setBlogSubmitting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [mediaError, setMediaError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const currentUser = session?.user || null;

      if (!isMounted) {
        return;
      }

      if (!currentUser) {
        setUser(null);
        setAuthChecked(true);
        return;
      }

      setUser({
        id: currentUser.id,
        name: currentUser.user_metadata?.full_name || 'NGO Lead',
        email: currentUser.email || 'No email available',
        avatar: currentUser.user_metadata?.avatar_url || '',
      });
      setAuthChecked(true);
    };

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) {
        return;
      }

      if (!session?.user) {
        setUser(null);
        setAuthChecked(true);
        return;
      }

      setUser({
        id: session.user.id,
        name: session.user.user_metadata?.full_name || 'NGO Lead',
        email: session.user.email || 'No email available',
        avatar: session.user.user_metadata?.avatar_url || '',
      });
      setAuthChecked(true);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadNgos = async () => {
      setLoading(true);
      setErrorMessage('');

      const { data, error } = await supabase
        .from('ngos')
        .select('*')
        .order('created_at', { ascending: false });

      if (!isMounted) {
        return;
      }

      if (error) {
        setErrorMessage(error.message);
        setNgos([]);
        setLoading(false);
        return;
      }

      setNgos(data || []);
      setLoading(false);
    };

    loadNgos();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!ngos.length) {
      setActiveNgo(null);
      return;
    }

    const matchedNgo = user?.email
      ? ngos.find(
          (ngo) => normalizeEmail(ngo.contact_email) === normalizeEmail(user.email)
        ) || null
      : null;

    setActiveNgo(matchedNgo || ngos[0] || null);
  }, [ngos, user]);

  useEffect(() => {
    if (!activeNgo?.id) {
      return;
    }

    let isMounted = true;

    const loadNgoCmsData = async () => {
      setMediaError('');

      const [
        drivesResponse,
        blogsResponse,
        imagesResponse,
        doctorsResponse,
        donorsResponse,
      ] = await Promise.all([
        supabase
          .from('ngo_drives')
          .select('*')
          .eq('ngo_id', activeNgo.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('ngo_blogs')
          .select('*')
          .eq('ngo_id', activeNgo.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('blog_images')
          .select('*')
          .eq('ngo_id', activeNgo.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('ngo_doctors')
          .select('*')
          .eq('ngo_id', activeNgo.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('ngo_donors')
          .select('*')
          .eq('ngo_id', activeNgo.id)
          .order('created_at', { ascending: false }),
      ]);

      if (!isMounted) {
        return;
      }

      const firstCriticalError = [
        drivesResponse.error,
        blogsResponse.error,
        doctorsResponse.error,
        donorsResponse.error,
      ].find(Boolean);

      if (firstCriticalError) {
        setErrorMessage(firstCriticalError.message);
        return;
      }

      if (imagesResponse.error) {
        setMediaError(imagesResponse.error.message);
      }

      setDrives(drivesResponse.data || []);
      setBlogs(blogsResponse.data || []);
      setImages(imagesResponse.error ? [] : imagesResponse.data || []);
      setConnectedDoctors(doctorsResponse.data || []);
      setConnectedDonors(donorsResponse.data || []);
    };

    loadNgoCmsData();

    return () => {
      isMounted = false;
    };
  }, [activeNgo]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setMobileOpen(false);
    window.location.href = '/login';
  };

  const handleGoogleLogin = async () => {
    const redirectUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent('/Ngos')}`;

    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
  };

  const uploadToNgoMedia = async (file, folder) => {
    const sanitizedName = file.name.replace(/\s+/g, '-');
    const filePath = `${folder}/${activeNgo.id}/${Date.now()}-${sanitizedName}`;

    const { error: uploadError } = await supabase.storage
      .from('ngo_media')
      .upload(filePath, file, {
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage.from('ngo_media').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleDriveSubmit = async (payload) => {
    if (!activeNgo?.id) {
      alert('No NGO is linked to this account. Set your NGO contact_email to your logged-in email first.');
      return;
    }

    setDriveSubmitting(true);

    const request = driveEditorRecord
      ? supabase
          .from('ngo_drives')
          .update({
            ...payload,
            ngo_id: activeNgo.id,
          })
          .eq('id', driveEditorRecord.id)
          .select()
          .single()
      : supabase
          .from('ngo_drives')
          .insert({
            ...payload,
            ngo_id: activeNgo.id,
          })
          .select()
          .single();

    const { data, error } = await request;

    if (error) {
      alert(error.message);
      setDriveSubmitting(false);
      return;
    }

    setDrives((current) => {
      if (driveEditorRecord) {
        return current.map((drive) => (drive.id === data.id ? data : drive));
      }

      return [data, ...current];
    });
    setDriveEditorRecord(null);
    setDriveSubmitting(false);
  };

  const handleDriveDelete = async (driveId) => {
    const { error } = await supabase.from('ngo_drives').delete().eq('id', driveId);

    if (error) {
      alert(error.message);
      return;
    }

    setDrives((current) => current.filter((drive) => drive.id !== driveId));
  };

  const handleBlogSubmit = async ({ title, content, cover_image, coverFile }) => {
    if (!activeNgo?.id) {
      alert('No NGO is linked to this account. Set your NGO contact_email to your logged-in email first.');
      return;
    }

    setBlogSubmitting(true);

    let coverImageUrl = cover_image || '';

    try {
      if (coverFile) {
        coverImageUrl = await uploadToNgoMedia(coverFile, 'blog-covers');
      }
    } catch (error) {
      alert(error.message);
      setBlogSubmitting(false);
      return;
    }

    const request = blogEditorRecord
      ? supabase
          .from('ngo_blogs')
          .update({
            ngo_id: activeNgo.id,
            title,
            content,
            cover_image: coverImageUrl,
          })
          .eq('id', blogEditorRecord.id)
          .select()
          .single()
      : supabase
          .from('ngo_blogs')
          .insert({
            ngo_id: activeNgo.id,
            title,
            content,
            cover_image: coverImageUrl,
          })
          .select()
          .single();

    const { data, error } = await request;

    if (error) {
      alert(error.message);
      setBlogSubmitting(false);
      return;
    }

    setBlogs((current) => {
      if (blogEditorRecord) {
        return current.map((blog) => (blog.id === data.id ? data : blog));
      }

      return [data, ...current];
    });
    setBlogEditorRecord(null);
    setBlogSubmitting(false);
  };

  const handleBlogDelete = async (blogId) => {
    const { error } = await supabase.from('ngo_blogs').delete().eq('id', blogId);

    if (error) {
      alert(error.message);
      return;
    }

    setBlogs((current) => current.filter((blog) => blog.id !== blogId));
  };

  const handleImageUpload = async ({ file, caption }) => {
    if (!activeNgo?.id) {
      alert('No NGO is linked to this account. Set your NGO contact_email to your logged-in email first.');
      return;
    }

    setImageUploading(true);

    try {
      const publicUrl = await uploadToNgoMedia(file, 'gallery');

      const { data, error } = await supabase
        .from('blog_images')
        .insert({
          ngo_id: activeNgo.id,
          image_url: publicUrl,
          caption,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      setImages((current) => [data, ...current]);
    } catch (error) {
      alert(error.message);
    } finally {
      setImageUploading(false);
    }
  };

  const filteredDrives = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    if (!query) {
      return drives;
    }

    return drives.filter((drive) =>
      [drive.title, drive.description, drive.location]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query))
    );
  }, [drives, searchValue]);

  const filteredBlogs = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    if (!query) {
      return blogs;
    }

    return blogs.filter((blog) =>
      [blog.title, blog.content]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query))
    );
  }, [blogs, searchValue]);

  const ngoCmsReady = Boolean(activeNgo?.id && user?.email);
  const setupChecklist = [
    !authChecked
      ? 'Authentication check is still in progress. Wait for the session to load.'
      : null,
    authChecked && !user?.email
      ? 'No Supabase session was found for this page. Sign in again with Google and confirm the callback finishes on /Ngos.'
      : null,
    !activeNgo?.id
      ? 'No NGO row is available in the `ngos` table.'
      : null,
    user?.email && activeNgo?.id && normalizeEmail(activeNgo.contact_email) !== normalizeEmail(user.email)
      ? 'This login is not linked to the active NGO. Set `ngos.contact_email` equal to your logged-in email.'
      : null,
  ].filter(Boolean);

  return (
    <RoleDashboardLayout
      user={user}
      mobileOpen={mobileOpen}
      onMobileOpen={() => setMobileOpen(true)}
      onMobileClose={() => setMobileOpen(false)}
      onLogout={handleLogout}
      onSwitchAccount={handleGoogleLogin}
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      platformName="Seva Swasthya"
      panelTitle="NGO CMS"
      navItems={navItems}
      tipTitle="NGO Tip"
      tipText="Keep drives, blogs, and media current so doctors and donors always see fresh, actionable activity."
      searchPlaceholder="Search drives, blogs, or media"
    >
      <section
        id="overview"
        className="rounded-3xl border border-teal-100 bg-white px-6 py-7 shadow-xl sm:px-8"
      >
        {loading ? (
          <div className="rounded-2xl border border-teal-100 bg-teal-50 p-6 text-sm text-slate-600">
            Loading NGO profile...
          </div>
        ) : errorMessage ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : activeNgo ? (
          <NgoSummaryCard ngo={activeNgo} />
        ) : (
          <div className="rounded-2xl border border-dashed border-teal-200 bg-teal-50 p-6 text-sm text-slate-600">
            No NGO records were returned from Supabase. Logged-in email:
            {' '}
            <span className="font-semibold text-teal-900">{user?.email || 'No email found'}</span>
            . Check that the `ngos` table has rows and your read policies allow `select`.
          </div>
        )}
      </section>

      {!ngoCmsReady ? (
        <section className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-xl">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-amber-700">
            NGO CMS Status
          </p>
          <div className="mt-4 space-y-3 text-sm text-amber-900">
            {setupChecklist.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-amber-200 bg-white px-4 py-3"
              >
                {item}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <div className="mt-8">
        <NGODashboard
          doctors={connectedDoctors}
          donors={connectedDonors}
          drives={drives}
          blogs={blogs}
          activeNgo={activeNgo}
        />
      </div>

      <section id="decisions" className="mt-8 space-y-6">
        <div className="rounded-3xl border border-teal-100 bg-white p-6 shadow-xl">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-teal-700">
            AI Decision Layer
          </p>
          <h3 className="mt-2 text-2xl font-extrabold text-teal-950">
            Village intervention recommendations generated by your model
          </h3>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            These reports are loaded from the `villages` table and summarize priority
            score, urgency level, and recommended NGO actions for each village.
          </p>
        </div>

        <ModelDecisionPreview />

        <VillageDecisionCard />
      </section>

      <section id="drives" className="mt-8 space-y-6">
        <DriveForm
          key={driveEditorRecord?.id || 'new-drive'}
          initialValues={driveEditorRecord}
          onSubmit={handleDriveSubmit}
          onCancel={() => setDriveEditorRecord(null)}
          submitting={driveSubmitting}
          disabled={!ngoCmsReady}
        />
        <DriveList
          drives={filteredDrives}
          onEdit={setDriveEditorRecord}
          onDelete={handleDriveDelete}
        />
      </section>

      <section id="media" className="mt-8">
        <ImageUploader
          onUpload={handleImageUpload}
          uploading={imageUploading}
          disabled={!ngoCmsReady}
          errorMessage={mediaError}
          images={images.map((image) => ({
            ...image,
            created_at: formatDate(image.created_at),
          }))}
        />
      </section>

      <section id="blogs" className="mt-8 space-y-6">
        <BlogEditor
          key={blogEditorRecord?.id || 'new-blog'}
          initialValues={blogEditorRecord}
          onSubmit={handleBlogSubmit}
          onCancel={() => setBlogEditorRecord(null)}
          submitting={blogSubmitting}
          disabled={!ngoCmsReady}
        />
        <BlogList
          blogs={filteredBlogs.map((blog) => ({
            ...blog,
            created_at: formatDate(blog.created_at),
          }))}
          onEdit={setBlogEditorRecord}
          onDelete={handleBlogDelete}
        />
      </section>
    </RoleDashboardLayout>
  );
}
