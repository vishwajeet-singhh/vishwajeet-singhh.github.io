import {visiblePlatforms} from "@/lib/stats";

/**
 * Feature flags. Flip a value to true and redeploy; hidden features keep all
 * their code and data, they just aren't rendered.
 */
export const FEATURES = {
    /**
     * The "Problem solving" section, its link in the nav bar, the LeetCode /
     * Codeforces / CodeChef icons under Contact, and the "Coding stats
     * updated" note in the footer. Individual profiles are controlled in
     * platform-visibility.ts.
     */
    problemSolving: true,
} as const;

/** Avoid an empty section and navigation link when every coding profile is hidden. */
export const SHOW_PROBLEM_SOLVING = FEATURES.problemSolving && visiblePlatforms().length > 0;
