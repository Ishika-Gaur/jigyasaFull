import Heropage from "@/sections/Heropage";
import Aboutus from "@/sections/Aboutus";
import Offersection from "@/sections/Offersection";
import Getinvolve from "@/sections/Getinvolve";
import Specialities from "@/sections/Specialities";
import Expertsection from "@/sections/Expertsection";
import Testimonialsection from "@/sections/Testimonialsection";
import Blogsection from "@/sections/Blogsection";
import Contactsection from "@/sections/Contactsection";
import Footer from "@/components/Footer";



export default function Home() {
  return (
    <>
      <Heropage />
      <Aboutus />
      <Offersection />
      <Specialities />
      <Getinvolve />
      <Expertsection />
      <Testimonialsection />
      <Blogsection />
      <Contactsection />
      <Footer />
    </>
  );
}
