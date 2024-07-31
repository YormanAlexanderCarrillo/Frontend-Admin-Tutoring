"use client";

import "react-responsive-carousel/lib/styles/carousel.min.css"; // Importa los estilos del carrusel
import { Carousel } from "react-responsive-carousel";
import { Link } from "@nextui-org/react";

export default function Home() {
  return (
    <div className="flex flex-col items-center pt-16">
      <img src="/Ingreso.png" alt="Logo" />
      <div className="w-full mt-8">
        <Carousel 
          className="w-3/4 mx-auto"
          autoPlay 
          interval={2000} 
          infiniteLoop 
          showThumbs={false}
          showStatus={false}
        >
          <div className="w-full h-64 flex items-center justify-center text-white text-2xl">
            <Link href="https://www.uptc.edu.co/sitio/portal/" target="_blank">
              <img src="/imagen1.png" alt="Logo" />
            </Link>
          </div>
          <div className="w-full h-64  flex items-center justify-center text-white text-2xl">
            <Link href="https://www.uptc.edu.co/sitio/portal/" target="_blank">
              <img src="/imagen2.jpg" alt="Logo" />
            </Link>
          </div>
          <div className="w-full h-64  flex items-center justify-center text-white text-2xl">
            <Link href="https://www.uptc.edu.co/sitio/portal/" target="_blank">
              <img src="/imagen3.jpg" alt="Logo" />
            </Link>
          </div>
        </Carousel>
      </div>
    </div>
  );
}
