/**
 * Feature flags. Flip a value to true and redeploy; hidden features keep all
 * their code and data, they just aren't rendered.
 */
export const FEATURES = {
    /**
     * The "Problem solving" section, its link in the nav bar, the LeetCode /
     * Codeforces / CodeChef / GFG icons under Contact, and the "Coding stats
     * updated" note in the footer. Hidden for now; turn on when ready.
     */
    problemSolving: false,
} as const;
