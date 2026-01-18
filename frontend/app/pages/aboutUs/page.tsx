'use client';

import React, { useRef } from 'react';
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const wikiHistory = [
  { year: "1985", title: "Inaugural Season", description: "Founded Feb 18 as Royal Richmond at Burnley Oval. Tony Marchett scored the first official goal (50') vs Waverley City. Safety was secured in Round 26 with a 3-2 win vs Dandenong City.", stat: "8th Place" },
  { year: "1986", title: "Yarraville Era", description: "Moved to Yarraville Oval. Dragan Vasic netted 14 goals in 8 consecutive matches, finishing as top scorer with 22 goals. Tony Marchett hit the club's first hat-trick vs Moreland Park Rangers.", stat: "5th Place" },
  { year: "1987", title: "First League Title", description: "Renamed Westgate FC. Pedro Gasco scored 18 goals. Recorded a massive 7-1 win over Eltham. Clinched the title with a 3-1 win over Altona City, finishing 1 point ahead of Mooroolbark.", stat: "🏆 Champions" },
  { year: "1988", title: "First Cup Title", description: "Debuted in Div 1, finishing 7th. Won the State League Cup after former South Melbourne striker Chris Andriotis scored the winner in a 1-0 final victory against Mooroolbark.", stat: "🏆 Cup Winners" },
  { year: "1989", title: "Survival Run", description: "A season of draws and grit. Earned crucial wins against Albion and Mooroolbark. Went undefeated from Round 19-23, including a 5-0 away victory at Mordialloc.", stat: "8th Place" },
  { year: "1990s", title: "The Div 1 Decade", description: "Maintained top-flight status for 15 seasons. Played the 1993 Harry Armstrong Cup final at Olympic Park as a curtain-raiser to the Dockerty Cup final.", stat: "Div 1 Mainstay" },
  { year: "2000", title: "Spiteri's Rescue", description: "Darryl Spiteri saved the club from relegation with hat-tricks against Westvale and Doncaster Rovers, finishing as the league's 5th leading scorer with 12 goals.", stat: "Safety Secured" },
  { year: "2001", title: "Second Cup Title", description: "Won the State League Cup Final 1-0 vs Cranbourne Comets. Dusko Delic scored the 67th-minute winner. Tony Lingurovski finished as 3rd top league scorer with 14 goals.", stat: "🏆 Cup Winners" },
  { year: "2002", title: "Record & Relegation", description: "Relegated after a play-off loss to North Coburg, but set a club record win: 9-3 vs Lalor United. Jim Gacovski scored three, while Adomako and Andersen netted doubles.", stat: "9-3 Record Win" },
  { year: "2003", title: "Div 2 North-West", description: "Started life in Div 2 positively, obtaining 10 points in the first five fixtures. The club finished the season mid-table while adjusting to the new division structure.", stat: "Rebuilding" },
  { year: "2004", title: "Promotion Charge", description: "Ivan Filiposki scored 7 goals in 6 games during a 9-week unbeaten streak. The club finished 4th, just one point shy of Keilor Park in a tightly contested season.", stat: "4th Place" },
  { year: "2005", title: "The Great Escape", description: "Despite an 11-week winless streak, the club narrowly avoided relegation by one point. Dino Grillo and Con Georgiou provided veteran leadership in the final rounds.", stat: "Survival" },
  { year: "2006", title: "Second League Title", description: "Clinched the Div 2 NW title with 3 games to spare. Dominic Murdaca was league top scorer (11 goals). Finished 6 points clear of Keilor to return to Division 1.", stat: "🏆 Champions" },
  { year: "2007", title: "Hume City Giant Kill", description: "Back in Div 1. Shocked undefeated Hume City with a 1-0 away win. Robert Trajanovski scored a hat-trick in a 3-3 draw with Brunswick City to help secure 7th place.", stat: "7th Place" },
  { year: "2008", title: "Div 1 Struggle", description: "A difficult campaign in Victorian State League Division 1. Despite competitive individual performances, the club suffered relegation back to Division 2.", stat: "Relegated" },
  { year: "2009", title: "Double Relegation", description: "A tough period resulting in a second consecutive relegation to Div 3. The club began focusing on youth development to stop the slide and rebuild the senior squad.", stat: "Relegated" },
  { year: "2010", title: "Title Return", description: "Bounced back immediately to win the Div 3 title. Josh D'Alessi scored a hat-trick in a 6-1 thrashing of Essendon United to seal promotion back to Division 2.", stat: "🏆 Champions" },
  { year: "2011", title: "Div 2 Stabilization", description: "Stabilized in Div 2 after the promotion surge. Joe De Bono scored a double in a crucial 4-1 win over Ballarat Red Devils late in the season.", stat: "9th Place" },
  { year: "2012", title: "The Draw Kings", description: "A season defined by 11 draws. Highlighted by a 4-2 win over La Trobe University where Raffael Origlia scored a first-half double.", stat: "7th Place" },
  { year: "2013", title: "Pre-NPL Transition", description: "The final year of the old league structure. The club maintained its position in the middle of the table, preparing for the reorganization of Victorian football.", stat: "Mid-Table" },
  { year: "2014", title: "State League 1 Era", description: "Due to the NPL introduction, Westgate moved into the new State League 1 North-West. The club focused on establishing itself in the new tier of the system.", stat: "Transition" },
  { year: "2015", title: "FFA Cup Run", description: "Dispatched Hampton Park 5-1 in the FFA Cup. In the league, high competition saw the club fighting in the upper-mid table throughout the season.", stat: "FFA Cup Rd 4" },
  { year: "2016", title: "SL1 NW Competition", description: "Continued competition in State League 1. The club focused on bringing through a new generation of players to compete with well-funded metropolitan rivals.", stat: "State League 1" },
  { year: "2017", title: "Tough Campaign", description: "A difficult year in SL1 NW that unfortunately ended in relegation to State League 2 after a string of narrow defeats in the second half of the season.", stat: "Relegated" },
  { year: "2018", title: "Infrastructure & Ardeer", description: "Unveiled a $1.5M redevelopment of Ardeer Reserve. The facility, renamed Oreana Park, provided the club a permanent, state-of-the-art home in the West.", stat: "Facility Build" },
  { year: "2019", title: "The Serbian Diaspora", description: "Reinforced the club's identity as Sindjelic. Strong community support at Ardeer Reserve drove the club to be a competitive force in State League 2.", stat: "Community Growth" },
  { year: "2020", title: "The Hiatus", description: "Like all Victorian clubs, the season was heavily disrupted and eventually cancelled due to global events, pausing the club's momentum on the pitch.", stat: "Season Cancelled" },
  { year: "2021", title: "Return to Play", description: "Football returned to Ardeer. The club used the shortened season to integrate new signings and prepare for a serious promotion push in the following year.", stat: "Rebuilding" },
  { year: "2022", title: "The Return", description: "Secured promotion to State 1 in the final round vs Epping City. Liam Cannell scored the legendary 65th-minute winner to seal a 2nd place finish.", stat: "🏆 Promoted" },
  { year: "2023", title: "Modern Dominance", description: "Returned to SL1 with a 3-1 win over Keilor Park. Nikola Stijacic led the league scoring early on, hitting the top of the ladder by Round 4.", stat: "Top of Ladder" },
  { year: "2024", title: "State League 1 NW", description: "A strong season in State League 1 North-West, finishing 3rd out of 12. The club remains a powerhouse under Chairman Slobodan Vulovic.", stat: "3rd Place" },
];

export default function AboutPage() {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: targetRef });

  // Map vertical scroll to horizontal movement
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-92%"]);
  
  // Progress bar scale
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Helper to scroll to specific history parts
  const scrollToPercent = (percent: number) => {
    const totalHeight = targetRef.current?.offsetHeight || 0;
    const startOffset = targetRef.current?.offsetTop || 0;
    window.scrollTo({
      top: startOffset + (totalHeight * percent),
      behavior: 'smooth'
    });
  };

  return (
    <main className="bg-white">
      <Navbar />
      
      <Hero 
        heading="Our Heritage" 
        message="Established 1985" 
        showButton={false} 
      />
      
      {/* Identity Section (White) - UPDATED STYLE */}
      <section className="max-w-7xl mx-auto px-6 py-24 bg-white relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-12">
            <div>
                <div className="inline-block bg-red-600 text-white px-4 py-1 skew-x-[-12deg] font-black uppercase text-sm italic mb-6">
                    Srpski Sportski Klub Sindjelić
                </div>
                <h2 className="text-5xl md:text-8xl font-black uppercase leading-[0.85] tracking-tighter">
                    Westgate <br/> <span className="text-red-600">Sindjelic</span>
                </h2>
            </div>
            
            {/* Split long text into styled blocks for a better look*/}
            <div className="space-y-10">
                <div className="relative pl-8 border-l-2 border-blue-900">
                    <p className="text-2xl text-gray-900 font-bold leading-tight uppercase tracking-tight italic">
                        Westgate Sindjelic Football Club or Srpski sportski klub Sindjelić is a Serbian Australian association football club located in Ardeer, Melbourne.
                    </p>
                    <p className="mt-4 text-gray-500 font-medium">
                        The club competes in the four tier, Victorian State League 1 North-West.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-100">
                    <div className="space-y-4">
                        <span className="text-xs font-black uppercase tracking-[0.3em] text-red-600">Origins</span>
                        <p className="text-gray-600 leading-relaxed text-sm">
                            Founded on 18 February 1985 as Royal Richmond, with its home ground based at Burnley Oval in the suburb of Richmond. In 1986, the club changed its home venue to Yarraville Oval and officially converted the club named to Westgate FC by 1987.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <span className="text-xs font-black uppercase tracking-[0.3em] text-red-600">Achievements</span>
                        <p className="text-gray-600 leading-relaxed text-sm">
                            Westgate FC have twice been crowned champions of the Victorian State League Cup and have won the Men's Karadjordje Cup five times and the Women's Karadjordje Cup four consecutive times.
                        </p>
                    </div>
                </div>
            </div>
          </div>
          <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl lg:sticky lg:top-32 bg-slate-50 border border-slate-200">
            <Image 
              src="/serbiaFlag.png" 
              alt="Westgate History" 
              fill 
              className="object-contain p-16" 
            />
          </div>
        </div>
      </section>

      {/* Horizontal Scroll Vault */}
      <section ref={targetRef} className="relative h-[1200vh]">
        <div className="sticky top-0 h-screen flex items-center overflow-hidden bg-[#0a0a0a]">
          
          <div className="absolute inset-0 z-0">
            <Image 
              src="/hero-bg.png" 
              alt="Background" 
              fill 
              className="object-cover opacity-30 grayscale contrast-125"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
          </div>

          <motion.div style={{ x }} className="flex gap-24 px-[10vw] items-center relative z-10">
            {/* Title Slide */}
            <div className="flex-shrink-0 w-[600px]">
                <h2 className="text-[140px] font-black text-white uppercase italic leading-[0.7] tracking-tighter">
                    THE <br/> <span className="text-red-600">HISTORY</span>
                </h2>
                <div className="flex items-center gap-4 mt-12">
                    <div className="h-1 w-32 bg-red-600" />
                    <p className="text-white font-bold tracking-[0.4em] uppercase text-sm">1985 — 2025</p>
                </div>
            </div>

            {/* Wikipedia Data Cards */}
            {wikiHistory.map((item, index) => (
              <div key={index} className="flex-shrink-0 w-[580px] relative group">
                <span className="absolute -top-32 -left-12 text-[220px] font-black text-white/[0.03] select-none pointer-events-none group-hover:text-red-600/[0.08] transition-all duration-1000 italic font-serif">
                    {item.year}
                </span>

                <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-14 rounded-[3rem] relative z-10 hover:border-red-600/40 transition-all duration-500 shadow-3xl">
                    <div className="flex justify-between items-center mb-10">
                        <span className="text-5xl font-black text-red-600 italic tracking-tighter">{item.year}</span>
                        <div className="bg-red-600/10 px-5 py-1.5 rounded-full text-[11px] font-black text-red-500 uppercase tracking-widest border border-red-600/20">
                            {item.stat}
                        </div>
                    </div>
                    
                    <h3 className="text-3xl font-black text-white uppercase mb-8 tracking-tight leading-none">
                        {item.title}
                    </h3>
                    
                    <p className="text-gray-400 text-xl leading-relaxed font-light">
                        {item.description}
                    </p>
                </div>
              </div>
            ))}

            {/* Wikipedia Call to Action */}
            <div className="flex-shrink-0 w-[600px] flex flex-col justify-center items-center px-12 text-center">
              <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-16 rounded-[3rem] w-full flex flex-col items-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-8">
                  <span className="text-black font-serif text-4xl font-bold">W</span>
                </div>
                <h3 className="text-3xl font-black text-white uppercase mb-6 tracking-tighter">
                  Want the full archive?
                </h3>
                <p className="text-gray-400 text-lg mb-10 leading-relaxed font-light">
                  Our history spans 40 years of detailed match reports, player statistics, and community milestones. Read the full archival records on Wikipedia.
                </p>
                <a href="https://en.wikipedia.org/wiki/Westgate_FC" target="_blank" rel="noopener noreferrer" className="bg-red-600 hover:bg-red-700 text-white font-black uppercase px-10 py-5 rounded-full transition-all">
                  Open Full Wiki →
                </a>
              </div>
            </div>

            {/* Ending Statement */}
            <div className="flex-shrink-0 w-[500px] text-left">
                <h4 className="text-white font-black text-6xl uppercase italic leading-none mb-6">
                  Still <br/> <span className="text-red-600">Writing</span> <br/> History.
                </h4>
                <div className="h-2 w-20 bg-white mb-8" />
            </div>
          </motion.div>

          {/* HISTORY NAVIGATION BAR (Bottom of Section) */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl px-6 z-50">
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-4">
                <div className="flex justify-between items-center gap-4 mb-3 px-2">
                    {/* Wikipedia Link pinned to the left */}
                    <div className="flex items-center gap-4">
                      <a 
                        href="https://en.wikipedia.org/wiki/Westgate_FC" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors px-3 py-1 rounded-md border border-white/10 group"
                      >
                        <span className="text-white font-serif font-bold text-xs">W</span>
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Full Wikipedia Website</span>
                      </a>
                      <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Timeline Progress</span>
                    </div>

                    <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em]">1985 — 2025</span>
                </div>
                
                <div className="flex justify-between gap-1 overflow-x-auto pb-2 no-scrollbar">
                    {["1985", "1990", "2001", "2006", "2010", "2022", "2024"].map((year, i) => (
                        <button 
                            key={year}
                            onClick={() => scrollToPercent(i / 7)}
                            className="flex-1 text-[11px] font-black text-white/50 hover:text-white hover:bg-red-600 py-2 rounded-lg transition-all uppercase italic"
                        >
                            {year}
                        </button>
                    ))}
                </div>
                {/* Visual Progress Indicator */}
                <motion.div 
                    className="h-1 bg-red-600 rounded-full mt-1 origin-left"
                    style={{ scaleX }}
                />
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <section className="py-40 bg-white text-center border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-7xl font-black uppercase italic tracking-tighter mb-8 text-black">
                The Sindjelic <span className="text-red-600">Standard</span>
            </h2>
            <p className="text-gray-500 text-2xl font-light leading-relaxed mb-12 italic">
                "Fudbal je više od igre. To je naša istorija."
            </p>
            <div className="w-24 h-1 bg-red-600 mx-auto"></div>
        </div>
      </section>
    </main>
  );
}