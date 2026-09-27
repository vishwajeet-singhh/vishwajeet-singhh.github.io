import { useEffect } from "react";
import emailjs from "@emailjs/browser";

function getTrafficInfo() {
    const params = new URLSearchParams(window.location.search);

    const utm_source = params.get("utm_source") || "";
    const utm_medium = params.get("utm_medium") || "";
    const utm_campaign = params.get("utm_campaign") || "";
    const utm_term = params.get("utm_term") || "";
    const utm_content = params.get("utm_content") || "";

    const referrer = document.referrer || "";

    const utmSourceLabels: Record<string, string> = {
        linkedin: "LinkedIn",
        naukri: "Naukri",
        cv: "Resume / CV",
        "cold-email": "Cold Email",
        google: "Google Search",
        github: "GitHub",
        reddit: "Reddit",
        facebook: "Facebook",
        instagram: "Instagram",
        x: "X / Twitter",
        twitter: "X / Twitter",
    };

    let trafficSource = "Direct / Unknown";
    let referrerHost = "Direct";

    // 1. UTM source has highest priority
    if (utm_source) {
        trafficSource =
            utmSourceLabels[utm_source.toLowerCase()] || utm_source;
    }

    // 2. Otherwise detect from browser referrer
    else if (referrer) {
        try {
            const referrerUrl = new URL(referrer);
            const hostname = referrerUrl.hostname.toLowerCase();

            referrerHost = hostname;

            // Search engines
            if (
                hostname === "google.com" ||
                hostname.endsWith(".google.com") ||
                hostname.endsWith(".google.co.in")
            ) {
                trafficSource = "Google Search";
            } else if (
                hostname === "bing.com" ||
                hostname.endsWith(".bing.com")
            ) {
                trafficSource = "Bing Search";
            } else if (
                hostname === "search.yahoo.com" ||
                hostname.endsWith(".yahoo.com")
            ) {
                trafficSource = "Yahoo Search";
            } else if (
                hostname === "duckduckgo.com" ||
                hostname.endsWith(".duckduckgo.com")
            ) {
                trafficSource = "DuckDuckGo";
            }

            // Job / professional platforms
            else if (
                hostname === "linkedin.com" ||
                hostname.endsWith(".linkedin.com")
            ) {
                trafficSource = "LinkedIn";
            } else if (
                hostname === "naukri.com" ||
                hostname.endsWith(".naukri.com")
            ) {
                trafficSource = "Naukri";
            }

            // Developer platforms
            else if (
                hostname === "github.com" ||
                hostname.endsWith(".github.com")
            ) {
                trafficSource = "GitHub";
            } else if (
                hostname === "stackoverflow.com" ||
                hostname.endsWith(".stackoverflow.com")
            ) {
                trafficSource = "Stack Overflow";
            }

            // Social platforms
            else if (
                hostname === "reddit.com" ||
                hostname.endsWith(".reddit.com")
            ) {
                trafficSource = "Reddit";
            } else if (
                hostname === "facebook.com" ||
                hostname.endsWith(".facebook.com")
            ) {
                trafficSource = "Facebook";
            } else if (
                hostname === "instagram.com" ||
                hostname.endsWith(".instagram.com")
            ) {
                trafficSource = "Instagram";
            } else if (
                hostname === "x.com" ||
                hostname.endsWith(".x.com") ||
                hostname === "twitter.com" ||
                hostname.endsWith(".twitter.com")
            ) {
                trafficSource = "X / Twitter";
            }

            // Anything else
            else {
                trafficSource = "Other";
            }
        } catch {
            trafficSource = "Other";
            referrerHost = "Unknown";
        }
    }

    return {
        trafficSource,

        utm_source: utm_source || "N/A",
        utm_medium: utm_medium || "N/A",
        utm_campaign: utm_campaign || "N/A",
        utm_term: utm_term || "N/A",
        utm_content: utm_content || "N/A",

        traffic_referrer: referrer || "Direct",
        referrer_host: referrerHost,

        landing_url:
            window.location.origin + window.location.pathname,

        full_url: window.location.href,
    };
}

const VisitorLogger = () => {
    useEffect(() => {
        // Do not log visitors during local development
        if (import.meta.env.DEV) return;

        async function logVisitor() {
            try {
                // 1. Fetch IP / location information
                const res = await fetch("https://ipapi.co/json/");

                if (!res.ok) {
                    throw new Error(`IP API failed: ${res.status}`);
                }

                const ipData = await res.json();

                // 2. Detect device
                const ua = navigator.userAgent || "";

                let deviceType = "Desktop";

                if (/Mobi|Android|iPhone|iPod/i.test(ua)) {
                    deviceType = "Mobile";
                } else if (/Tablet|iPad/i.test(ua)) {
                    deviceType = "Tablet";
                }

                // 3. Get traffic information
                const trafficInfo = getTrafficInfo();

                // 4. Build EmailJS template parameters
                const templateParams = {
                    ...ipData,

                    deviceType,
                    platform: navigator.platform,
                    screen: `${window.screen.width}x${window.screen.height}`,
                    ua,

                    url: window.location.href,
                    referrer: document.referrer || "Direct",
                    timestamp: new Date().toISOString(),

                    subject: "🌍 New Visitor on Portfolio",

                    // Traffic source
                    traffic_source: trafficInfo.trafficSource,

                    // UTM information
                    utm_source: trafficInfo.utm_source,
                    utm_medium: trafficInfo.utm_medium,
                    utm_campaign: trafficInfo.utm_campaign,
                    utm_term: trafficInfo.utm_term,
                    utm_content: trafficInfo.utm_content,

                    // Referrer information
                    traffic_referrer: trafficInfo.traffic_referrer,
                    referrer_host: trafficInfo.referrer_host,

                    // URLs
                    landing_url: trafficInfo.landing_url,
                    full_url: trafficInfo.full_url,
                };

                // 5. EmailJS credentials
                const serviceID = "service_oe313cl";
                const templateID = "template_wtmzd6p";

                // PUBLIC KEY - safe for frontend
                const publicKey = "x8wsX1gsx1tqedpYW";

                // 6. Send email
                await emailjs.send(
                    serviceID,
                    templateID,
                    templateParams,
                    publicKey
                );

                console.log("Visitor logged successfully");
            } catch (err) {
                console.warn("Visitor logging failed:", err);
            }
        }

        logVisitor();
    }, []);

    return null;
};

export default VisitorLogger;