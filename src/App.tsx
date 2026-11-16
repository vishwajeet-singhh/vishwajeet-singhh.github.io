import About from "@/components/About";
import Contact from "@/components/Contact";
import Experience from "@/components/Experience";
import Hero from "@/components/Hero";
import OpenSource from "@/components/OpenSource";
import ProblemSolving from "@/components/ProblemSolving";
import ProfileSidebar from "@/components/ProfileSidebar";
import SiteHeader from "@/components/SiteHeader";
import Stack from "@/components/Stack";
import StatsProvider from "@/components/StatsProvider";
import VisitorLogger from "@/components/VisitorLogger";
import {SHOW_PROBLEM_SOLVING} from "@/data/features";

const App = () => (
    <StatsProvider>
        <VisitorLogger/>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-accent focus:px-3 focus:py-2 focus:text-white">
            Skip to content
        </a>
        <SiteHeader/>
        <div className="page-container grid items-start gap-6 py-5 sm:py-7 lg:grid-cols-[minmax(0,1fr)_270px]">
            <main id="main" tabIndex={-1} className="min-w-0">
                <Hero/>
                <About/>
                <Experience/>
                <OpenSource/>
                {SHOW_PROBLEM_SOLVING && <ProblemSolving/>}
                <Stack/>
                <Contact/>
            </main>
            <ProfileSidebar/>
        </div>
    </StatsProvider>
);

export default App;
