import {FileText, Github, Linkedin, Mail} from "lucide-react";
import profileImage from "@/assets/profile-dev.png";
import {RESUME_URL} from "@/lib/resume";

const LandingPage = () => (
    <main className="landing-page">
        <div className="landing-orbit landing-orbit-one" aria-hidden="true"/>
        <div className="landing-orbit landing-orbit-two" aria-hidden="true"/>
        <div className="landing-spark landing-spark-one" aria-hidden="true"/>
        <div className="landing-spark landing-spark-two" aria-hidden="true"/>
        <section className="landing-card" aria-labelledby="landing-title">
            <p className="landing-status" style={{textTransform: "none"}}>
                <span aria-hidden="true"/>Inchoate
            </p>
            <div className="landing-photo-frame">
                <img
                    className="landing-photo"
                    src={profileImage}
                    alt="Vishwajeet Pratap Singh"
                />
            </div>

            <div className="landing-intro">
                <h1 id="landing-title">Vishwajeet Pratap Singh</h1>
                <p className="landing-role py-0.75">Inquisitive Practitioner of Software Engineering</p>
                <p className="landing-tagline"></p>
            </div>

            <div className="landing-message">
                <h2> Intent · Pragmatism · Ingenuity · Meticulousness </h2>
                <p> Portfolio taking shape. Find the rest of me scattered across the usual haunts below.</p>
            </div>

            <nav className="profile-links" aria-label="Vishwajeet Pratap Singh’s profiles and contact links">
                <div className="profile-group">
                    <a className="profile-link" href="https://github.com/vishwajeet-singhh" target="_blank"
                       rel="noopener noreferrer">
                        <Github aria-hidden="true" size={18}/><span>GitHub</span>
                    </a>
                </div>
                <div className="profile-group">
                    <a className="profile-link" href="https://www.linkedin.com/in/vishyysingh/" target="_blank"
                       rel="noopener noreferrer">
                        <Linkedin aria-hidden="true" size={18}/><span>LinkedIn</span>
                    </a>
                </div>
                <div className="profile-group profile-group-full">
                    <a className="profile-link profile-link-featured" href={RESUME_URL} target="_blank"
                       rel="noopener noreferrer">
                        <FileText aria-hidden="true" size={18}/><span>Resume</span>
                    </a>
                </div>
                <div className="profile-group profile-group-full">
                    <a className="profile-link profile-link-mail" href="mailto:vishy.devv@gmail.com">
                        <Mail aria-hidden="true" size={18}/><span>Anything for me? Mail me</span>
                    </a>
                </div>
            </nav>
        </section>

        <footer className="landing-footer">© 2026 Vishwajeet Pratap Singh</footer>
    </main>
);

export default LandingPage;
