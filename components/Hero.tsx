import React from 'react';
import { Spotlight } from './ui/Spotlight';
import { cn } from "@/lib/utils";
import { TextGenerateEffect } from "./ui/text-generate-effect";
import MagicButton from "./ui/MagicButton";
import { FaLocationArrow } from 'react-icons/fa';

const Hero = () => {


  return (
    <div className="hero pb-20 pt-36">
      <div>
        <Spotlight className='-top-40 left-10 md:-left-32 md:-top-20 h-screen' fill="white"/>
        <Spotlight className='-top-10 left-full h-[80vh] w-[50vh] md:-top-20 h-screen' fill="purple"/>
        <Spotlight className='-top-28 left-80 h-[80vh] w-[50vh] h-screen' fill="blue"/>
      </div>
      
      <div className="flex h-screen w-full dark:bg-grid-white/[0.3] 
        bg-grid-black/[0.2]
        items-center justify-center bg-white dark:bg-[#080a10] absolute
        left-0 top-0">
        <div
          className={cn(
            "absolute inset-0",
            "[background-size:40px_40px]",
            "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
            "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
          )}
        />
        {/* Radial gradient for the container to give a faded look */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-[#111620]"></div>
      </div>

      <div className='flex justify-center my-20 z-10 relative'>
        <div className='max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] 
          flex flex-col items-center justify-center'>
          <h2 className='uppercase tracking-widest text-xs text-center
            text-blue-100 max-w-80'>
            Dynamic web experiences with next.js
          </h2>

          <TextGenerateEffect 
            words="Transforming Concepts into Seamless User Experiences"
            className='text-center text-[40px] md:text-5xl lg:text-6xl'
          />

          <p className='text-center  md:tracking-wider md:text-lg 
            lg:text-xl mb-4 text-sm max-w-100 '>
            Hello, I&apos;m Dasun.A 2nd year Computer engineering undergraduate.
          </p>

          <a href="#about">
            <MagicButton title="See my work" icon={<FaLocationArrow />} 
              position="right"/>
          </a>
          
        </div>
      </div>

    </div>
  );
};

export default Hero;