/**
 * 메인·하위 페이지 공통 배경 (히어로와 동일한 그라데이션).
 * layout 또는 각 페이지에서 main 콘텐츠를 이 컴포넌트로 감싸 사용.
 */
export const pageBackgroundClass =
  "min-h-screen bg-gradient-to-b from-teal-50 via-white to-white";

export default function PageBackground({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`${pageBackgroundClass} ${className}`.trim()}>
      {children}
    </div>
  );
}
