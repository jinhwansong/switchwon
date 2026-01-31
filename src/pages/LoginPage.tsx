import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useToastStore } from '@/store/useToastStore';
import { useLogin } from '@/hooks/useLogin';
import logo from '@/assets/ionLogo.svg';
import Button from '@/components/common/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const { login } = useAuthStore((state) => state);
  const showToast = useToastStore((state) => state.showToast);
  const { mutate: loginMutation, isPending } = useLogin();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginMutation(email, {
      onSuccess: (data) => {
        login(data.data.token);
        showToast('로그인되었습니다.', 'success');
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <main className="w-full max-w-140 space-y-12">
        <header className="text-center">
          <img
            src={logo}
            alt="switchwon logo"
            className="w-20 h-20 mx-auto mb-6"
          />
          <h3 className="text-5xl font-bold text-(--gray-700) mb-2">
            반갑습니다.
          </h3>
          <p className="text-[2rem] text-(--gray-600) font-medium">
            로그인 정보를 입력해주세요.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-3 bg-(--gray-0) block px-8 py-6 rounded-[1.25rem] border border-(--gray-300)"
        >
          <label className="block text-(--gray-600) text-xl font-medium">
            <span className="block">이메일 주소를 입력해주세요.</span>
            <span className="flex items-center bg-(--gray-white) border border-(--gray-700) rounded-xl p-6 mt-3 mb-8 w-full">
              <input
                id="email"
                type="email"
                placeholder="test@test.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isPending}
                className="font-semibold  w-full outline-none"
              />
            </span>
          </label>

          <Button
            type="submit"
            disabled={isPending || !email}
            variant="primary"
            full
          >
            {isPending ? '로그인 중...' : '로그인 하기'}
          </Button>
        </form>
      </main>
    </div>
  );
}
