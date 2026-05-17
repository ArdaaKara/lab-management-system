import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import useAuthStore from '@/stores/useAuthStore';
import useUiStore from '@/stores/useUiStore';
import { updateProfile } from '@/services/userService';
import { changePassword } from '@/services/authService';

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Yönetici',
  TEACHER: 'Öğretmen',
  TECHNICIAN: 'Teknisyen',
};

const ROLE_COLORS: Record<string, string> = {
  ADMIN: 'var(--accent)',
  TEACHER: 'var(--color-info)',
  TECHNICIAN: 'var(--color-success)',
};

const profileSchema = z.object({
  fullName: z.string().min(2, 'En az 2 karakter olmalı').max(100, 'En fazla 100 karakter'),
  email: z.string().email('Geçerli bir e-posta adresi girin'),
});

const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, 'Mevcut şifre zorunludur'),
    newPassword: z.string().min(8, 'En az 8 karakter olmalı'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Şifreler eşleşmiyor',
    path: ['confirmPassword'],
  })
  .refine((d) => d.newPassword !== d.oldPassword, {
    message: 'Yeni şifre eski şifreyle aynı olamaz',
    path: ['newPassword'],
  });

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

const sectionStyle: React.CSSProperties = {
  maxWidth: 640,
  paddingBottom: 32,
  marginBottom: 32,
  borderBottom: '1px solid var(--border-subtle)',
};

const sectionHeadingStyle: React.CSSProperties = {
  fontFamily: 'Inter',
  fontWeight: 600,
  fontSize: 16,
  color: 'var(--text-primary)',
  letterSpacing: '-0.02em',
  margin: '0 0 20px 0',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'Inter',
  fontSize: 13,
  fontWeight: 500,
  color: 'var(--text-secondary)',
  marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  background: 'var(--bg-raised)',
  border: '1px solid var(--border-default)',
  borderRadius: 6,
  color: 'var(--text-primary)',
  fontFamily: 'Inter',
  fontSize: 14,
  outline: 'none',
  transition: 'border-color 120ms ease',
  boxSizing: 'border-box',
};

const errorStyle: React.CSSProperties = {
  fontFamily: 'Inter',
  fontSize: 12,
  color: 'var(--color-danger)',
  marginTop: 4,
};

const helperStyle: React.CSSProperties = {
  fontFamily: 'Inter',
  fontSize: 12,
  color: 'var(--text-muted)',
  marginTop: 4,
};

const fieldGroupStyle: React.CSSProperties = {
  marginBottom: 16,
};

function InputField({
  label,
  error,
  helper,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; helper?: string }) {
  return (
    <div style={fieldGroupStyle}>
      <label style={labelStyle}>{label}</label>
      <input
        {...props}
        style={{
          ...inputStyle,
          borderColor: error ? 'var(--color-danger)' : 'var(--border-default)',
        }}
        onFocus={e => (e.currentTarget.style.borderColor = error ? 'var(--color-danger)' : 'var(--border-strong)')}
        onBlur={e => (e.currentTarget.style.borderColor = error ? 'var(--color-danger)' : 'var(--border-default)')}
      />
      {helper && !error && <p style={helperStyle}>{helper}</p>}
      {error && <p style={errorStyle}>{error}</p>}
    </div>
  );
}

function ReadOnlyField({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={fieldGroupStyle}>
      <label style={labelStyle}>{label}</label>
      <p
        style={{
          margin: 0,
          fontFamily: mono ? "'JetBrains Mono', monospace" : 'Inter',
          fontSize: 14,
          color: 'var(--text-muted)',
          padding: '8px 0',
        }}
      >
        {value}
      </p>
    </div>
  );
}

function ProfileForm() {
  const user = useAuthStore(s => s.user);
  const updateUser = useAuthStore(s => s.updateUser);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName ?? '',
      email: user?.email ?? '',
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) return;
    try {
      await updateProfile(user.id, data);
      updateUser({ fullName: data.fullName, email: data.email });
      toast.success('Profil güncellendi.');
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { fieldErrors?: Record<string, string> } } };
      const fieldErrors = apiErr?.response?.data?.fieldErrors;
      if (fieldErrors) {
        Object.entries(fieldErrors).forEach(([field, message]) => {
          setError(field as keyof ProfileFormValues, { message });
        });
      } else {
        toast.error('Profil güncellenemedi.');
      }
    }
  };

  const primaryRole = user?.roles?.[0] ?? 'TECHNICIAN';

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputField
        label="Ad Soyad"
        error={errors.fullName?.message}
        {...register('fullName')}
      />
      <InputField
        label="E-posta"
        type="email"
        error={errors.email?.message}
        autoComplete="email"
        {...register('email')}
      />

      <ReadOnlyField
        label="Kullanıcı Adı"
        value={user?.username ?? user?.email ?? '—'}
        mono
      />

      <div style={fieldGroupStyle}>
        <span style={labelStyle}>Rol</span>
        <span
          style={{
            display: 'inline-block',
            padding: '2px 10px',
            borderRadius: 4,
            fontFamily: 'Inter',
            fontSize: 12,
            fontWeight: 600,
            color: ROLE_COLORS[primaryRole] ?? 'var(--text-secondary)',
            background: 'transparent',
            border: `1px solid ${ROLE_COLORS[primaryRole] ?? 'var(--border-default)'}`,
          }}
        >
          {ROLE_LABELS[primaryRole] ?? primaryRole}
        </span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: '8px 20px',
            background: isSubmitting ? 'var(--accent-muted)' : 'var(--accent)',
            border: 'none',
            borderRadius: 6,
            color: '#0A0A0F',
            fontFamily: 'Inter',
            fontSize: 13,
            fontWeight: 600,
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            opacity: isSubmitting ? 0.7 : 1,
            transition: 'opacity 120ms',
          }}
        >
          {isSubmitting ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
        </button>
      </div>
    </form>
  );
}

function PasswordForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: PasswordFormValues) => {
    try {
      await changePassword(data.oldPassword, data.newPassword);
      toast.success('Şifreniz güncellendi.');
      reset();
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { message?: string } } };
      toast.error(apiErr?.response?.data?.message ?? 'Şifre güncellenemedi.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputField
        label="Mevcut Şifre"
        type="password"
        autoComplete="current-password"
        error={errors.oldPassword?.message}
        {...register('oldPassword')}
      />
      <InputField
        label="Yeni Şifre"
        type="password"
        autoComplete="new-password"
        helper="En az 8 karakter olmalı."
        error={errors.newPassword?.message}
        {...register('newPassword')}
      />
      <InputField
        label="Yeni Şifre (Tekrar)"
        type="password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: '8px 20px',
            background: 'var(--bg-raised)',
            border: '1px solid var(--border-default)',
            borderRadius: 6,
            color: 'var(--text-primary)',
            fontFamily: 'Inter',
            fontSize: 13,
            fontWeight: 500,
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            opacity: isSubmitting ? 0.7 : 1,
            transition: 'opacity 120ms',
          }}
        >
          {isSubmitting ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
        </button>
      </div>
    </form>
  );
}

function DensitySection() {
  const density = useUiStore(s => s.density);
  const setDensity = useUiStore(s => s.setDensity);

  const btnBase: React.CSSProperties = {
    padding: '7px 16px',
    fontFamily: 'Inter',
    fontSize: 13,
    border: '1px solid var(--border-default)',
    cursor: 'pointer',
    transition: 'background 120ms, border-color 120ms, color 120ms',
  };

  const active: React.CSSProperties = {
    background: 'var(--bg-raised)',
    borderColor: 'var(--border-strong)',
    color: 'var(--text-primary)',
  };

  const inactive: React.CSSProperties = {
    background: 'transparent',
    color: 'var(--text-secondary)',
  };

  return (
    <div style={{ maxWidth: 640 }}>
      <h2 style={sectionHeadingStyle}>Görünüm</h2>
      <div style={fieldGroupStyle}>
        <span style={labelStyle}>Grid Yoğunluğu</span>
        <p style={{ ...helperStyle, marginBottom: 10, marginTop: 0 }}>
          Lab grid'inde bilgisayar hücrelerinin boyutu
        </p>
        <div style={{ display: 'flex', borderRadius: 6, overflow: 'hidden', width: 'fit-content' }}>
          <button
            onClick={() => setDensity('comfortable')}
            style={{
              ...btnBase,
              borderRight: 'none',
              borderRadius: '6px 0 0 6px',
              ...(density === 'comfortable' ? active : inactive),
            }}
          >
            Geniş
          </button>
          <button
            onClick={() => setDensity('compact')}
            style={{
              ...btnBase,
              borderRadius: '0 6px 6px 0',
              ...(density === 'compact' ? active : inactive),
            }}
          >
            Kompakt
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProfileSettingsPage() {
  return (
    <div
      style={{
        padding: '32px 32px 64px',
        background: 'var(--bg-base)',
        minHeight: '100%',
      }}
    >
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 4px' }}>
          Ayarlar
        </p>
        <h1 style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 22, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
          Profil
        </h1>
      </div>

      <section aria-labelledby="profile-section-heading" style={sectionStyle}>
        <h2 id="profile-section-heading" style={sectionHeadingStyle}>Profil Bilgileri</h2>
        <ProfileForm />
      </section>

      <section aria-labelledby="password-section-heading" style={sectionStyle}>
        <h2 id="password-section-heading" style={sectionHeadingStyle}>Şifre Değiştir</h2>
        <PasswordForm />
      </section>

      <section aria-labelledby="appearance-section-heading">
        <DensitySection />
      </section>
    </div>
  );
}
