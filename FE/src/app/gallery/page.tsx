import Navbar from "@/components/Navbar";
import WidgetGallery from "@/components/WidgetGallery";
import Footer from "@/components/Footer";

export const metadata = {
  title: "위젯 갤러리 | Hello Notion",
  description:
    "지금 바로 사용 가능한 위젯들이에요. 링크를 복사해서 노션에 붙여넣으면 끝!",
};

export default function GalleryPage() {
  return (
    <>
      <Navbar />
      <main>
        <WidgetGallery />
      </main>
      <Footer />
    </>
  );
}
