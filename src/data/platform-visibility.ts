import type {PlatformId} from "@/lib/stats";

/**
 * Coding-profile visibility. Edit these values and rebuild/redeploy the site.
 * false hides a platform; true or a missing entry shows it.
 * Profiles and their saved stats are kept when hidden.
 */
export const PLATFORM_VISIBILITY: Partial<Record<PlatformId, boolean>> = {
    leetcode: true,
    codeforces: true,
    codechef: false,
};

export const isPlatformVisible = (id: PlatformId) => PLATFORM_VISIBILITY[id] !== false;
