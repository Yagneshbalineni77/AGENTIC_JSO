export interface UserProfile {
    id: number;
    name: string;
    title: string;
    skills: string[];
    experienceYears: number;
    cvUploaded: boolean;
}

export interface SkillRequirement {
    name: string;
    isCore: boolean; // Core = heavy penalty if missing. Bonus = nice to have
}

export interface Job {
    id: string;
    title: string;
    company: string;
    requiredSkills: SkillRequirement[];
    minExperienceYears: number;
    description: string;
    salary: string;
}

export interface CandidateApplicant {
    id: string;
    blindName: string;
    title: string;
    skills: string[];
    experienceYears: number;
}

export const currentUser: UserProfile = {
    id: 1,
    name: "Alex Candidate",
    title: "Frontend Developer",
    skills: ["ReactJS", "Next.js", "TailwindCSS", "JS", "TypeScript"],
    experienceYears: 4,
    cvUploaded: true
};

export const jobs: Job[] = [
    {
        id: "job-1",
        title: "Senior Frontend Engineer",
        company: "TechCorp Inc.",
        requiredSkills: [
            { name: "React", isCore: true },
            { name: "Next.js", isCore: true },
            { name: "TypeScript", isCore: true },
            { name: "Tailwind", isCore: false },
            { name: "GraphQL", isCore: false }
        ],
        minExperienceYears: 5,
        description: "Looking for an experienced frontend engineer to lead our core UI architecture.",
        salary: "$140k - $170k"
    },
    {
        id: "job-2",
        title: "Machine Learning Engineer",
        company: "AI Innovations",
        requiredSkills: [
            { name: "Python", isCore: true },
            { name: "PyTorch", isCore: true },
            { name: "YOLO", isCore: true },
            { name: "AWS", isCore: false }
        ],
        minExperienceYears: 3,
        description: "Join our computer vision team to optimize deep learning models.",
        salary: "$160k - $200k"
    },
    {
        id: "job-3",
        title: "React Developer",
        company: "WebStudio",
        requiredSkills: [
            { name: "React", isCore: true },
            { name: "JavaScript", isCore: true },
            { name: "CSS", isCore: false }
        ],
        minExperienceYears: 2,
        description: "Building fast, interactive web applications for enterprise clients.",
        salary: "$110k - $130k"
    },
    {
        id: "job-4",
        title: "Backend Node.js Dev",
        company: "DataFlow Systems",
        requiredSkills: [
            { name: "Node.js", isCore: true },
            { name: "Express", isCore: true },
            { name: "MongoDB", isCore: true },
            { name: "Docker", isCore: false }
        ],
        minExperienceYears: 4,
        description: "Design and maintain high-volume REST APIs and backend services.",
        salary: "$120k - $150k"
    },
    {
        id: "job-5",
        title: "Full Stack Developer",
        company: "StartupX",
        requiredSkills: [
            { name: "React", isCore: true },
            { name: "Node.js", isCore: true },
            { name: "TypeScript", isCore: true },
            { name: "PostgreSQL", isCore: false }
        ],
        minExperienceYears: 3,
        description: "End-to-end development in a fast-paced environment.",
        salary: "$130k - $160k"
    }
];

export const hrCandidates: CandidateApplicant[] = [
    {
        id: "c-1",
        blindName: "Applicant Alpha",
        title: "Frontend Specialist",
        skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
        experienceYears: 6
    },
    {
        id: "c-2",
        blindName: "Applicant Beta",
        title: "Software Engineer",
        skills: ["Java", "Spring Boot", "MySQL", "AWS"],
        experienceYears: 4
    },
    {
        id: "c-3",
        blindName: "Applicant Gamma",
        title: "UI Developer",
        skills: ["ReactJS", "Vanilla JS", "CSS3", "Figma"],
        experienceYears: 1
    },
    {
        id: "c-4",
        blindName: "Applicant Delta",
        title: "Full Stack Engineer",
        skills: ["React", "Node", "TS", "Tailwind", "Postgres"],
        experienceYears: 4
    },
    {
        id: "c-5",
        blindName: "Applicant Epsilon",
        title: "Backend Developer",
        skills: ["Python", "Django", "PostgreSQL", "Docker Compose"],
        experienceYears: 5
    }
];

export interface FitScoreResult {
    score: number;
    matchedSkills: string[];
    missingSkills: string[];
    auditLog: string;
    synonymMatches: { original: string; matchedAs: string }[];
}

// Global Semantic Synonym Database
const SYNONYM_MAP: Record<string, string[]> = {
    "react": ["reactjs", "react.js"],
    "javascript": ["js", "vanilla js", "ecmascript"],
    "typescript": ["ts"],
    "node.js": ["node", "nodejs"],
    "tailwind": ["tailwindcss", "tailwind css"],
    "postgresql": ["postgres", "psql"],
    "css": ["css3", "styles"],
    "docker": ["docker compose", "containers"]
};

function normalizeSkill(skill: string): string {
    const lower = skill.toLowerCase().trim();
    // Check if it's a known synonym, return the base key if so
    for (const [baseSkill, synonyms] of Object.entries(SYNONYM_MAP)) {
        if (lower === baseSkill || synonyms.includes(lower)) {
            return baseSkill;
        }
    }
    return lower;
}

export function calculateFitScore(candidateSkills: string[], jobRequirements: SkillRequirement[], candidateExp: number, jobMinExp: number): FitScoreResult {
    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];
    const synonymMatches: { original: string; matchedAs: string }[] = [];

    // Normalize candidate candidate skills map
    const candidateSkillMap = new Map<string, string>(); // normalized -> original
    candidateSkills.forEach(skill => {
        candidateSkillMap.set(normalizeSkill(skill), skill);
    });

    let maxPoints = 0;
    let earnedPoints = 0;

    // 1. Calculate Skill Points (Core = 3pts, Bonus = 1pt)
    for (const req of jobRequirements) {
        const weight = req.isCore ? 3 : 1;
        maxPoints += weight;

        const normalizedReq = normalizeSkill(req.name);

        if (candidateSkillMap.has(normalizedReq)) {
            earnedPoints += weight;
            matchedSkills.push(req.name);

            const originalCandidateSkill = candidateSkillMap.get(normalizedReq)!;
            // If the strings don't match exactly (ignoring case), record it as a semantic synonym match
            if (originalCandidateSkill.toLowerCase().trim() !== req.name.toLowerCase().trim() &&
                originalCandidateSkill.toLowerCase().trim() !== normalizedReq) {
                synonymMatches.push({ original: originalCandidateSkill, matchedAs: req.name });
            }
        } else {
            missingSkills.push(req.name);
        }
    }

    // 2. Experience Factor (max 2 points impact)
    const expDelta = candidateExp - jobMinExp;
    maxPoints += 2; // Allocate 2 max points for experience

    if (expDelta >= 0) {
        // Meets or exceeds experience
        earnedPoints += 2;
    } else if (expDelta === -1) {
        // Only 1 year short, half penalty
        earnedPoints += 1;
    } else {
        // More than 1 year short, full penalty (0 points earned for exp)
        earnedPoints += 0;
    }

    // Convert to percentage
    const scoreRaw = earnedPoints / maxPoints;
    const score = Math.round(scoreRaw * 100);

    let auditLog = `Skill Assessment: ${earnedPoints - (expDelta >= 0 ? 2 : (expDelta === -1 ? 1 : 0))}/${maxPoints - 2} points. `;
    if (synonymMatches.length > 0) {
        auditLog += `AI Semantic Matcher successfully equated: ${synonymMatches.map(s => `'${s.original}' as '${s.matchedAs}'`).join(", ")}. `;
    }
    if (expDelta >= 0) {
        auditLog += `Candidate meets/exceeds experience (${candidateExp}y vs required ${jobMinExp}y). (+2 pts)`;
    } else {
        auditLog += `Candidate is short on experience (${candidateExp}y vs required ${jobMinExp}y). Point penalty applied.`;
    }

    return {
        score,
        matchedSkills,
        missingSkills,
        auditLog,
        synonymMatches
    };
}
