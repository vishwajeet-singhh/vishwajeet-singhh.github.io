import {useEffect} from "react";
import emailjs from "@emailjs/browser";

/**
 * Extracts UTM parameters + HTTP referrer from the current page and derives a
 * human-readable traffic source.
 *
 * Detection priority (per requirements):
 *   1. If utm_source is present, use it (mapped to a friendly label).
 *   2. Otherwise fall back to inspecting document.referrer.
 *
 * NOTE ON FORWARDED LINKS:
 *   UTM parameters live in the URL itself. If a visitor forwards a tagged link
 *   (e.g. the LinkedIn/Naukri/CV/cold-email URLs) to someone else, the forwarded
 *   visit will still report the ORIGINAL utm_source. This is an inherent
 *   limitation of URL-based attribution and is intentionally NOT "corrected"
 *   here — the source reflects where the link originated, not who clicked it.
 *
 * All fields gracefully degrade: missing UTM params and empty referrers are
 * normalised to safe, readable defaults so the email never shows "undefined".
 */
function getTrafficInfo() {
    const params = new URLSearchParams(window.location.search);

    // Gracefully handle missing UTM parameters -> empty string default.
    const utm_source = params.get("utm_source") || "";
    const utm_medium = params.get("utm_medium") || "";
    const utm_campaign = params.get("utm_campaign") || "";
    const utm_term = params.get("utm_term") || "";
    const utm_content = params.get("utm_content") || "";

    // Gracefully handle empty referrers.
    const referrer = document.referrer || "";

    // Friendly labels for the explicit UTM sources we hand out.
    const utmSourceLabels: Record<string, string> = {
        linkedin: "LinkedIn",
        naukri: "Naukri",
        cv: "Resume / CV",
        "cold-email": "Cold Email",
        google: "Google Search",
    };

    let trafficSource: string;

    if (utm_source) {
        // 1️⃣ UTM source wins when present.
        trafficSource = utmSourceLabels[utm_source.toLowerCase()] || utm_source;
    } else if (referrer) {
        // 2️⃣ Otherwise infer from the referrer host.
        const ref = referrer.toLowerCase();
        if (ref.includes("linkedin.com")) trafficSource = "LinkedIn";
        else if (ref.includes("naukri.com")) trafficSource = "Naukri";
        else if (ref.includes("google.com")) trafficSource = "Google Search";
        else trafficSource = "Other";
    } else {
        // Empty referrer + no UTM => typed URL, bookmark, or app click.
        trafficSource = "Direct / Unknown";
    }

    return {
        trafficSource,
        utm_source: utm_source || "N/A",
        utm_medium: utm_medium || "N/A",
        utm_campaign: utm_campaign || "N/A",
        utm_term: utm_term || "N/A",
        utm_content: utm_content || "N/A",
        // Keep a distinct, readable value for the email (existing `referrer`
        // field below already sends "Direct" when empty for backward compat).
        traffic_referrer: referrer || "Direct",
        landing_url: window.location.origin + window.location.pathname,
    };
}

const VisitorLogger = () => {
    useEffect(() => {
        // Local dev reloads aren't visitors.
        if (import.meta.env.DEV) return;

        async function logVisitor() {
            try {
                // 1️⃣ Fetch full IP data
                const res = await fetch("https://ipapi.co/json/");
                const ipData = await res.json();

                // 2️⃣ Detect device type
                const ua = navigator.userAgent || "";
                let deviceType = "Desktop";
                if (/Mobi|Android|iPhone|iPad|iPod/i.test(ua)) deviceType = "Mobile";
                else if (/Tablet|iPad/i.test(ua)) deviceType = "Tablet";

                // 3️⃣ Derive traffic / UTM attribution (additive, non-breaking)
                const trafficInfo = getTrafficInfo();

                // 4️⃣ Build template params (all fields merged)
                const templateParams = {
                    ...ipData, // includes all API fields
                    deviceType,
                    platform: navigator.platform,
                    screen: `${window.screen.width}x${window.screen.height}`,
                    ua,
                    url: window.location.href,
                    referrer: document.referrer || "Direct",
                    timestamp: new Date().toISOString(),
                    subject: "🌍 New Visitor on Portfolio",
                    // --- Traffic Information (new, appended section) ---
                    traffic_source: trafficInfo.trafficSource,
                    utm_source: trafficInfo.utm_source,
                    utm_medium: trafficInfo.utm_medium,
                    utm_campaign: trafficInfo.utm_campaign,
                    utm_term: trafficInfo.utm_term,
                    utm_content: trafficInfo.utm_content,
                    traffic_referrer: trafficInfo.traffic_referrer,
                    landing_url: trafficInfo.landing_url,
                    full_url: window.location.href,
                };

                // 5️⃣ EmailJS credentials
                const serviceID = "service_irg2tqs";
                const templateID = "template_wmt8mng";
                const publicKey = "P3AEzbFLAgiLPNdtE";

                // 6️⃣ Send the email
                await emailjs.send(serviceID, templateID, templateParams, publicKey);
            } catch (err) {
                console.warn("logging failed:", err);
            }
        }

        logVisitor();
    }, []);

    return null;
};

export default VisitorLogger;