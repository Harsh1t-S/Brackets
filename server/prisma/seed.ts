import { PrismaClient, Difficulty } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

interface TestCaseInput {
  input: string;
  output: string;
  isHidden?: boolean;
}

const problems: Array<{
  title: string;
  slug: string;
  difficulty: Difficulty;
  description: string;
  constraints: string;
  acceptance: number;
  likes: number;
  dislikes: number;
  premium?: boolean;
  examples: { input: string; output: string; explanation?: string }[];
  starterCode: Record<string, string>;
  solutionCode: Record<string, string>;
  tags: string[];
  testCases: TestCaseInput[];
}> = [
  {
    title: "Two Sum",
    slug: "two-sum",
    difficulty: Difficulty.EASY,
    description:
      "Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to <code>target</code>. You may assume that each input has exactly one solution, and you may not use the same element twice.",
    constraints: "2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9",
    acceptance: 52.4,
    likes: 4210,
    dislikes: 132,
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "nums[0] + nums[1] == 9, so we return [0, 1].",
      },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
    ],
    starterCode: {
      javascript: "function twoSum(nums, target) {\n\n}",
      python: "def two_sum(nums, target):\n    pass",
      java: "class Solution {\n  public int[] twoSum(int[] nums, int target) {\n\n  }\n}",
      cpp: "class Solution {\npublic:\n  vector<int> twoSum(vector<int>& nums, int target) {\n\n  }\n};",
    },
    solutionCode: {
      javascript:
        "function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const diff = target - nums[i];\n    if (map.has(diff)) return [map.get(diff), i];\n    map.set(nums[i], i);\n  }\n}",
    },
    tags: ["Array", "Hash Map"],
    testCases: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]" },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
      { input: "nums = [3,3], target = 6", output: "[0,1]", isHidden: true },
    ],
  },
  {
    title: "Palindrome Number",
    slug: "palindrome-number",
    difficulty: Difficulty.EASY,
    description:
      "Given an integer <code>x</code>, return <code>true</code> if <code>x</code> is a palindrome, and <code>false</code> otherwise.",
    constraints: "-2^31 <= x <= 2^31 - 1",
    acceptance: 57.1,
    likes: 1890,
    dislikes: 402,
    examples: [
      {
        input: "x = 121",
        output: "true",
        explanation: "Reads as 121 from left to right and right to left.",
      },
      {
        input: "x = -121",
        output: "false",
        explanation: "From right to left it becomes 121-, which is not a palindrome.",
      },
    ],
    starterCode: {
      javascript: "function isPalindrome(x) {\n\n}",
      python: "def is_palindrome(x):\n    pass",
      java: "class Solution {\n  public boolean isPalindrome(int x) {\n\n  }\n}",
      cpp: "class Solution {\npublic:\n  bool isPalindrome(int x) {\n\n  }\n};",
    },
    solutionCode: {
      javascript:
        "function isPalindrome(x) {\n  const s = String(x);\n  return s === [...s].reverse().join('');\n}",
    },
    tags: ["Math"],
    testCases: [
      { input: "x = 121", output: "true" },
      { input: "x = -121", output: "false" },
      { input: "x = 10", output: "false", isHidden: true },
    ],
  },
  {
    title: "Valid Parentheses",
    slug: "valid-parentheses",
    difficulty: Difficulty.EASY,
    description:
      "Given a string <code>s</code> containing just the characters <code>()[]{}</code>, determine if the input string is valid. Brackets must close in the correct order and each closing bracket matches the same type of opening bracket.",
    constraints: "1 <= s.length <= 10^4\ns consists of parentheses only.",
    acceptance: 41.8,
    likes: 3120,
    dislikes: 210,
    examples: [
      { input: 's = "()[]{}"', output: "true" },
      { input: 's = "(]"', output: "false" },
    ],
    starterCode: {
      javascript: "function isValid(s) {\n\n}",
      python: "def is_valid(s):\n    pass",
    },
    solutionCode: {
      javascript:
        "function isValid(s) {\n  const stack = [];\n  const map = { ')': '(', ']': '[', '}': '{' };\n  for (const c of s) {\n    if (!map[c]) stack.push(c);\n    else if (stack.pop() !== map[c]) return false;\n  }\n  return stack.length === 0;\n}",
    },
    tags: ["String", "Stack"],
    testCases: [
      { input: 's = "()[]{}"', output: "true" },
      { input: 's = "(]"', output: "false" },
      { input: 's = "([)]"', output: "false", isHidden: true },
    ],
  },
  {
    title: "Longest Substring Without Repeating Characters",
    slug: "longest-substring-without-repeating-characters",
    difficulty: Difficulty.MEDIUM,
    description:
      "Given a string <code>s</code>, find the length of the longest substring without repeating characters.",
    constraints: "0 <= s.length <= 5 * 10^4",
    acceptance: 34.9,
    likes: 2760,
    dislikes: 118,
    examples: [
      {
        input: 's = "abcabcbb"',
        output: "3",
        explanation: 'The answer is "abc", with length 3.',
      },
      {
        input: 's = "bbbbb"',
        output: "1",
        explanation: 'The answer is "b", with length 1.',
      },
    ],
    starterCode: {
      javascript: "function lengthOfLongestSubstring(s) {\n\n}",
      python: "def length_of_longest_substring(s):\n    pass",
    },
    solutionCode: {
      javascript:
        "function lengthOfLongestSubstring(s) {\n  const seen = new Map();\n  let start = 0, max = 0;\n  for (let i = 0; i < s.length; i++) {\n    if (seen.has(s[i]) && seen.get(s[i]) >= start) start = seen.get(s[i]) + 1;\n    seen.set(s[i], i);\n    max = Math.max(max, i - start + 1);\n  }\n  return max;\n}",
    },
    tags: ["String", "Sliding Window", "Hash Map"],
    testCases: [
      { input: 's = "abcabcbb"', output: "3" },
      { input: 's = "bbbbb"', output: "1" },
      { input: 's = "pwwkew"', output: "3", isHidden: true },
    ],
  },
  {
    title: "Add Two Numbers",
    slug: "add-two-numbers",
    difficulty: Difficulty.MEDIUM,
    description:
      "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each node contains a single digit. Add the two numbers and return the sum as a linked list.",
    constraints: "1 <= number of nodes <= 100\n0 <= Node.val <= 9",
    acceptance: 39.2,
    likes: 2440,
    dislikes: 480,
    examples: [
      {
        input: "l1 = [2,4,3], l2 = [5,6,4]",
        output: "[7,0,8]",
        explanation: "342 + 465 = 807.",
      },
    ],
    starterCode: {
      javascript: "function addTwoNumbers(l1, l2) {\n\n}",
      python: "def add_two_numbers(l1, l2):\n    pass",
    },
    solutionCode: {},
    tags: ["Linked List", "Math", "Recursion"],
    testCases: [
      { input: "l1 = [2,4,3], l2 = [5,6,4]", output: "[7,0,8]" },
      { input: "l1 = [0], l2 = [0]", output: "[0]", isHidden: true },
      {
        input: "l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]",
        output: "[8,9,9,9,0,0,0,1]",
        isHidden: true,
      },
    ],
  },
  {
    title: "Course Schedule",
    slug: "course-schedule",
    difficulty: Difficulty.MEDIUM,
    description:
      "There are a total of <code>numCourses</code> courses labeled from 0 to numCourses - 1. Given the prerequisites, return true if you can finish all courses (i.e. the graph has no cycle).",
    constraints: "1 <= numCourses <= 2000\n0 <= prerequisites.length <= 5000",
    acceptance: 46.3,
    likes: 1520,
    dislikes: 62,
    premium: true,
    examples: [
      {
        input: "numCourses = 2, prerequisites = [[1,0]]",
        output: "true",
        explanation: "Take course 0, then course 1.",
      },
    ],
    starterCode: {
      javascript: "function canFinish(numCourses, prerequisites) {\n\n}",
      python: "def can_finish(num_courses, prerequisites):\n    pass",
    },
    solutionCode: {},
    tags: ["Graph", "Topological Sort", "BFS"],
    testCases: [
      { input: "numCourses = 2, prerequisites = [[1,0]]", output: "true" },
      {
        input: "numCourses = 2, prerequisites = [[1,0],[0,1]]",
        output: "false",
        isHidden: true,
      },
    ],
  },
  {
    title: "Merge k Sorted Lists",
    slug: "merge-k-sorted-lists",
    difficulty: Difficulty.HARD,
    description:
      "You are given an array of <code>k</code> linked-lists, each sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
    constraints: "0 <= k <= 10^4\n0 <= lists[i].length <= 500",
    acceptance: 36.4,
    likes: 1980,
    dislikes: 94,
    examples: [
      {
        input: "lists = [[1,4,5],[1,3,4],[2,6]]",
        output: "[1,1,2,3,4,4,5,6]",
      },
    ],
    starterCode: {
      javascript: "function mergeKLists(lists) {\n\n}",
      python: "def merge_k_lists(lists):\n    pass",
    },
    solutionCode: {},
    tags: ["Linked List", "Heap", "Divide and Conquer"],
    testCases: [
      {
        input: "lists = [[1,4,5],[1,3,4],[2,6]]",
        output: "[1,1,2,3,4,4,5,6]",
      },
      { input: "lists = []", output: "[]", isHidden: true },
      { input: "lists = [[]]", output: "[]", isHidden: true },
    ],
  },
  {
    title: "Median of Two Sorted Arrays",
    slug: "median-of-two-sorted-arrays",
    difficulty: Difficulty.HARD,
    description:
      "Given two sorted arrays <code>nums1</code> and <code>nums2</code> of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).",
    constraints: "0 <= m, n <= 1000\n1 <= m + n <= 2000",
    acceptance: 38.7,
    likes: 2100,
    dislikes: 240,
    premium: true,
    examples: [
      {
        input: "nums1 = [1,3], nums2 = [2]",
        output: "2.00000",
        explanation: "merged = [1,2,3], median is 2.",
      },
    ],
    starterCode: {
      javascript: "function findMedianSortedArrays(nums1, nums2) {\n\n}",
      python: "def find_median_sorted_arrays(nums1, nums2):\n    pass",
    },
    solutionCode: {},
    tags: ["Array", "Binary Search", "Divide and Conquer"],
    testCases: [
      { input: "nums1 = [1,3], nums2 = [2]", output: "2.00000" },
      {
        input: "nums1 = [1,2], nums2 = [3,4]",
        output: "2.50000",
        isHidden: true,
      },
    ],
  },
];

async function main() {
  // --- Users ---
  const [adminPassword, userPassword] = await Promise.all([
    bcrypt.hash("admin123", 10),
    bcrypt.hash("user1234", 10),
  ]);

  const admin = await prisma.user.upsert({
    where: { email: "admin@codeforge.dev" },
    update: { role: "ADMIN", name: "Bracket Admin" },
    create: {
      name: "Bracket Admin",
      email: "admin@codeforge.dev",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "user@codeforge.dev" },
    update: {},
    create: {
      name: "Jane Developer",
      email: "user@codeforge.dev",
      password: userPassword,
      role: "USER",
    },
  });

  // --- Problems ---
  await prisma.bookmark.deleteMany();
  await prisma.problem.deleteMany();

  for (let i = 0; i < problems.length; i++) {
    const { testCases, ...p } = problems[i];

    await prisma.problem.create({
      data: {
        ...p,
        number: i + 1,
        createdById: admin.id,
        testCases: {
          create: testCases.map((tc, idx) => ({
            input: tc.input,
            output: tc.output,
            isHidden: tc.isHidden ?? false,
            order: idx,
          })),
        },
      },
    });
  }

  console.log(`✅ Seed completed: ${problems.length} problems, 2 users`);
  console.log("   Admin login: admin@codeforge.dev / admin123");
  console.log("   User login:  user@codeforge.dev / user1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
