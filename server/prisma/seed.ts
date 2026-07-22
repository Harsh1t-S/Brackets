import { PrismaClient, Difficulty } from "@prisma/client";
import bcrypt from "bcrypt";
import { solutions } from "./solutions";

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
  companies?: string[];
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
    companies: ["Amazon", "Google", "Apple", "Adobe"],
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
    companies: ["Amazon", "Adobe", "Bloomberg"],
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
    companies: ["Amazon", "Meta", "Microsoft", "Bloomberg"],
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
    companies: ["Amazon", "Adobe", "Bloomberg"],
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
    companies: ["Amazon", "Microsoft", "Bloomberg"],
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
    companies: ["Amazon", "Google", "Meta"],
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
    companies: ["Amazon", "Google", "Microsoft", "Uber"],
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
    companies: ["Google", "Amazon", "Adobe"],
    testCases: [
      { input: "nums1 = [1,3], nums2 = [2]", output: "2.00000" },
      {
        input: "nums1 = [1,2], nums2 = [3,4]",
        output: "2.50000",
        isHidden: true,
      },
    ],
  },
  {
    title: "Best Time to Buy and Sell Stock",
    slug: "best-time-to-buy-and-sell-stock",
    difficulty: Difficulty.EASY,
    description:
      "You are given an array <code>prices</code> where <code>prices[i]</code> is the price of a stock on day <code>i</code>. Maximize profit by choosing one day to buy and a later day to sell. Return the maximum profit, or <code>0</code> if no profit is possible.",
    constraints: "1 <= prices.length <= 10^5\n0 <= prices[i] <= 10^4",
    acceptance: 54.3,
    likes: 2980,
    dislikes: 96,
    examples: [
      { input: "prices = [7,1,5,3,6,4]", output: "5", explanation: "Buy on day 2 (price 1), sell on day 5 (price 6)." },
    ],
    starterCode: {
      javascript: "function maxProfit(prices) {\n\n}",
      python: "def max_profit(prices):\n    pass",
    },
    solutionCode: {
      javascript:
        "function maxProfit(prices) {\n  let min = Infinity, best = 0;\n  for (const p of prices) {\n    min = Math.min(min, p);\n    best = Math.max(best, p - min);\n  }\n  return best;\n}",
    },
    tags: ["Array", "Dynamic Programming"],
    companies: ["Amazon", "Google", "Bloomberg"],
    testCases: [
      { input: "prices = [7,1,5,3,6,4]", output: "5" },
      { input: "prices = [7,6,4,3,1]", output: "0", isHidden: true },
    ],
  },
  {
    title: "Contains Duplicate",
    slug: "contains-duplicate",
    difficulty: Difficulty.EASY,
    description:
      "Given an integer array <code>nums</code>, return <code>true</code> if any value appears at least twice, and <code>false</code> if every element is distinct.",
    constraints: "1 <= nums.length <= 10^5\n-10^9 <= nums[i] <= 10^9",
    acceptance: 61.0,
    likes: 1740,
    dislikes: 210,
    examples: [{ input: "nums = [1,2,3,1]", output: "true" }],
    starterCode: {
      javascript: "function containsDuplicate(nums) {\n\n}",
      python: "def contains_duplicate(nums):\n    pass",
    },
    solutionCode: {
      javascript:
        "function containsDuplicate(nums) {\n  return new Set(nums).size !== nums.length;\n}",
    },
    tags: ["Array", "Hash Map"],
    companies: ["Amazon", "Adobe"],
    testCases: [
      { input: "nums = [1,2,3,1]", output: "true" },
      { input: "nums = [1,2,3,4]", output: "false", isHidden: true },
    ],
  },
  {
    title: "Maximum Subarray",
    slug: "maximum-subarray",
    difficulty: Difficulty.MEDIUM,
    description:
      "Given an integer array <code>nums</code>, find the contiguous subarray with the largest sum and return that sum.",
    constraints: "1 <= nums.length <= 10^5\n-10^4 <= nums[i] <= 10^4",
    acceptance: 50.2,
    likes: 3410,
    dislikes: 140,
    examples: [
      { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "[4,-1,2,1] has the largest sum 6." },
    ],
    starterCode: {
      javascript: "function maxSubArray(nums) {\n\n}",
      python: "def max_sub_array(nums):\n    pass",
    },
    solutionCode: {
      javascript:
        "function maxSubArray(nums) {\n  let best = nums[0], cur = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    cur = Math.max(nums[i], cur + nums[i]);\n    best = Math.max(best, cur);\n  }\n  return best;\n}",
    },
    tags: ["Array", "Dynamic Programming"],
    companies: ["Microsoft", "LinkedIn", "Amazon"],
    testCases: [
      { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6" },
      { input: "nums = [1]", output: "1", isHidden: true },
    ],
  },
  {
    title: "Merge Two Sorted Lists",
    slug: "merge-two-sorted-lists",
    difficulty: Difficulty.EASY,
    description:
      "You are given the heads of two sorted linked lists <code>list1</code> and <code>list2</code>. Splice them together into one sorted list and return its head.",
    constraints: "The number of nodes in both lists is in the range [0, 50].",
    acceptance: 63.4,
    likes: 2210,
    dislikes: 88,
    examples: [{ input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]" }],
    starterCode: {
      javascript: "function mergeTwoLists(list1, list2) {\n\n}",
      python: "def merge_two_lists(list1, list2):\n    pass",
    },
    solutionCode: {},
    tags: ["Linked List", "Recursion"],
    companies: ["Amazon", "Microsoft", "Apple"],
    testCases: [
      { input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]" },
      { input: "list1 = [], list2 = []", output: "[]", isHidden: true },
    ],
  },
  {
    title: "Climbing Stairs",
    slug: "climbing-stairs",
    difficulty: Difficulty.EASY,
    description:
      "You are climbing a staircase that takes <code>n</code> steps to reach the top. Each time you can climb 1 or 2 steps. In how many distinct ways can you reach the top?",
    constraints: "1 <= n <= 45",
    acceptance: 52.0,
    likes: 2650,
    dislikes: 82,
    examples: [{ input: "n = 3", output: "3", explanation: "1+1+1, 1+2, 2+1." }],
    starterCode: {
      javascript: "function climbStairs(n) {\n\n}",
      python: "def climb_stairs(n):\n    pass",
    },
    solutionCode: {
      javascript:
        "function climbStairs(n) {\n  let a = 1, b = 1;\n  for (let i = 0; i < n; i++) [a, b] = [b, a + b];\n  return a;\n}",
    },
    tags: ["Dynamic Programming", "Math"],
    companies: ["Adobe", "Amazon"],
    testCases: [
      { input: "n = 2", output: "2" },
      { input: "n = 3", output: "3", isHidden: true },
    ],
  },
  {
    title: "Binary Search",
    slug: "binary-search",
    difficulty: Difficulty.EASY,
    description:
      "Given a sorted (ascending) array of integers <code>nums</code> and a <code>target</code>, return the index of <code>target</code> or <code>-1</code> if it is not present. Your solution must run in O(log n) time.",
    constraints: "1 <= nums.length <= 10^4\nAll integers in nums are unique.",
    acceptance: 58.1,
    likes: 1620,
    dislikes: 40,
    examples: [{ input: "nums = [-1,0,3,5,9,12], target = 9", output: "4" }],
    starterCode: {
      javascript: "function search(nums, target) {\n\n}",
      python: "def search(nums, target):\n    pass",
    },
    solutionCode: {
      javascript:
        "function search(nums, target) {\n  let lo = 0, hi = nums.length - 1;\n  while (lo <= hi) {\n    const mid = (lo + hi) >> 1;\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) lo = mid + 1; else hi = mid - 1;\n  }\n  return -1;\n}",
    },
    tags: ["Array", "Binary Search"],
    companies: ["Google", "Meta"],
    testCases: [
      { input: "nums = [-1,0,3,5,9,12], target = 9", output: "4" },
      { input: "nums = [-1,0,3,5,9,12], target = 2", output: "-1", isHidden: true },
    ],
  },
  {
    title: "Valid Anagram",
    slug: "valid-anagram",
    difficulty: Difficulty.EASY,
    description:
      "Given two strings <code>s</code> and <code>t</code>, return <code>true</code> if <code>t</code> is an anagram of <code>s</code>, and <code>false</code> otherwise.",
    constraints: "1 <= s.length, t.length <= 5 * 10^4\ns and t consist of lowercase English letters.",
    acceptance: 63.0,
    likes: 1490,
    dislikes: 55,
    examples: [{ input: 's = "anagram", t = "nagaram"', output: "true" }],
    starterCode: {
      javascript: "function isAnagram(s, t) {\n\n}",
      python: "def is_anagram(s, t):\n    pass",
    },
    solutionCode: {
      javascript:
        "function isAnagram(s, t) {\n  if (s.length !== t.length) return false;\n  const c = {};\n  for (const ch of s) c[ch] = (c[ch] || 0) + 1;\n  for (const ch of t) { if (!c[ch]) return false; c[ch]--; }\n  return true;\n}",
    },
    tags: ["Hash Map", "String", "Sorting"],
    companies: ["Amazon", "Uber", "Bloomberg"],
    testCases: [
      { input: 's = "anagram", t = "nagaram"', output: "true" },
      { input: 's = "rat", t = "car"', output: "false", isHidden: true },
    ],
  },
  {
    title: "Reverse Linked List",
    slug: "reverse-linked-list",
    difficulty: Difficulty.EASY,
    description:
      "Given the <code>head</code> of a singly linked list, reverse the list and return the new head.",
    constraints: "The number of nodes is in the range [0, 5000].",
    acceptance: 73.2,
    likes: 3300,
    dislikes: 60,
    examples: [{ input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]" }],
    starterCode: {
      javascript: "function reverseList(head) {\n\n}",
      python: "def reverse_list(head):\n    pass",
    },
    solutionCode: {},
    tags: ["Linked List", "Recursion"],
    companies: ["Meta", "Microsoft", "Amazon"],
    testCases: [
      { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]" },
      { input: "head = []", output: "[]", isHidden: true },
    ],
  },
  {
    title: "Group Anagrams",
    slug: "group-anagrams",
    difficulty: Difficulty.MEDIUM,
    description:
      "Given an array of strings <code>strs</code>, group the anagrams together. You may return the answer in any order.",
    constraints: "1 <= strs.length <= 10^4\n0 <= strs[i].length <= 100",
    acceptance: 66.1,
    likes: 1980,
    dislikes: 70,
    examples: [
      { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]' },
    ],
    starterCode: {
      javascript: "function groupAnagrams(strs) {\n\n}",
      python: "def group_anagrams(strs):\n    pass",
    },
    solutionCode: {
      javascript:
        "function groupAnagrams(strs) {\n  const m = new Map();\n  for (const s of strs) {\n    const k = [...s].sort().join('');\n    (m.get(k) || m.set(k, []).get(k)).push(s);\n  }\n  return [...m.values()];\n}",
    },
    tags: ["Hash Map", "String", "Sorting"],
    companies: ["Amazon", "Uber", "Facebook"],
    testCases: [
      { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]' },
      { input: 'strs = [""]', output: '[[""]]', isHidden: true },
    ],
  },
  {
    title: "Number of Islands",
    slug: "number-of-islands",
    difficulty: Difficulty.MEDIUM,
    description:
      "Given an <code>m x n</code> 2D grid of <code>'1'</code>s (land) and <code>'0'</code>s (water), return the number of islands. An island is surrounded by water and formed by connecting adjacent land horizontally or vertically.",
    constraints: "1 <= m, n <= 300\ngrid[i][j] is '0' or '1'.",
    acceptance: 57.4,
    likes: 2870,
    dislikes: 65,
    examples: [
      { input: 'grid = [["1","1","0"],["1","0","0"],["0","0","1"]]', output: "2" },
    ],
    starterCode: {
      javascript: "function numIslands(grid) {\n\n}",
      python: "def num_islands(grid):\n    pass",
    },
    solutionCode: {},
    tags: ["Graph", "Depth-First Search", "Matrix"],
    companies: ["Amazon", "Google", "Microsoft"],
    testCases: [
      { input: 'grid = [["1","1","0"],["1","0","0"],["0","0","1"]]', output: "2" },
    ],
  },
  {
    title: "Coin Change",
    slug: "coin-change",
    difficulty: Difficulty.MEDIUM,
    description:
      "You are given an integer array <code>coins</code> and an integer <code>amount</code>. Return the fewest number of coins needed to make up that amount, or <code>-1</code> if it cannot be made.",
    constraints: "1 <= coins.length <= 12\n0 <= amount <= 10^4",
    acceptance: 44.0,
    likes: 2540,
    dislikes: 60,
    examples: [{ input: "coins = [1,2,5], amount = 11", output: "3", explanation: "11 = 5 + 5 + 1." }],
    starterCode: {
      javascript: "function coinChange(coins, amount) {\n\n}",
      python: "def coin_change(coins, amount):\n    pass",
    },
    solutionCode: {
      javascript:
        "function coinChange(coins, amount) {\n  const dp = Array(amount + 1).fill(Infinity);\n  dp[0] = 0;\n  for (let a = 1; a <= amount; a++)\n    for (const c of coins)\n      if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);\n  return dp[amount] === Infinity ? -1 : dp[amount];\n}",
    },
    tags: ["Dynamic Programming", "Array"],
    companies: ["Amazon", "Google"],
    testCases: [
      { input: "coins = [1,2,5], amount = 11", output: "3" },
      { input: "coins = [2], amount = 3", output: "-1", isHidden: true },
    ],
  },
  {
    title: "Product of Array Except Self",
    slug: "product-of-array-except-self",
    difficulty: Difficulty.MEDIUM,
    description:
      "Given an integer array <code>nums</code>, return an array <code>answer</code> such that <code>answer[i]</code> is the product of all elements except <code>nums[i]</code>. Solve it without division and in O(n) time.",
    constraints: "2 <= nums.length <= 10^5\n-30 <= nums[i] <= 30",
    acceptance: 65.2,
    likes: 2760,
    dislikes: 45,
    examples: [{ input: "nums = [1,2,3,4]", output: "[24,12,8,6]" }],
    starterCode: {
      javascript: "function productExceptSelf(nums) {\n\n}",
      python: "def product_except_self(nums):\n    pass",
    },
    solutionCode: {
      javascript:
        "function productExceptSelf(nums) {\n  const n = nums.length, res = Array(n).fill(1);\n  let pre = 1;\n  for (let i = 0; i < n; i++) { res[i] = pre; pre *= nums[i]; }\n  let post = 1;\n  for (let i = n - 1; i >= 0; i--) { res[i] *= post; post *= nums[i]; }\n  return res;\n}",
    },
    tags: ["Array", "Prefix Sum"],
    companies: ["Meta", "Amazon", "Apple"],
    testCases: [
      { input: "nums = [1,2,3,4]", output: "[24,12,8,6]" },
      { input: "nums = [-1,1,0,-3,3]", output: "[0,0,9,0,0]", isHidden: true },
    ],
  },
  {
    title: "Roman to Integer",
    slug: "roman-to-integer",
    difficulty: Difficulty.EASY,
    description:
      "Given a Roman numeral string <code>s</code>, convert it to an integer.",
    constraints: "1 <= s.length <= 15\ns is a valid Roman numeral in the range [1, 3999].",
    acceptance: 58.9,
    likes: 1420,
    dislikes: 90,
    examples: [{ input: 's = "LVIII"', output: "58", explanation: "L = 50, V = 5, III = 3." }],
    starterCode: {
      javascript: "function romanToInt(s) {\n\n}",
      python: "def roman_to_int(s):\n    pass",
    },
    solutionCode: {},
    tags: ["Hash Map", "Math", "String"],
    companies: ["Amazon", "Microsoft", "Facebook"],
    testCases: [
      { input: 's = "III"', output: "3" },
      { input: 's = "MCMXCIV"', output: "1994", isHidden: true },
    ],
  },
  {
    title: "Longest Common Prefix",
    slug: "longest-common-prefix",
    difficulty: Difficulty.EASY,
    description:
      "Write a function to find the longest common prefix string amongst an array of strings <code>strs</code>. Return <code>\"\"</code> if there is none.",
    constraints: "1 <= strs.length <= 200\n0 <= strs[i].length <= 200",
    acceptance: 40.5,
    likes: 1310,
    dislikes: 120,
    examples: [{ input: 'strs = ["flower","flow","flight"]', output: '"fl"' }],
    starterCode: {
      javascript: "function longestCommonPrefix(strs) {\n\n}",
      python: "def longest_common_prefix(strs):\n    pass",
    },
    solutionCode: {},
    tags: ["String"],
    companies: ["Adobe", "Amazon"],
    testCases: [
      { input: 'strs = ["flower","flow","flight"]', output: '"fl"' },
      { input: 'strs = ["dog","racecar","car"]', output: '""', isHidden: true },
    ],
  },
  {
    title: "Remove Duplicates from Sorted Array",
    slug: "remove-duplicates-from-sorted-array",
    difficulty: Difficulty.EASY,
    description:
      "Given an ascending sorted array <code>nums</code>, remove duplicates in-place so each unique element appears once, and return the number of unique elements.",
    constraints: "1 <= nums.length <= 3 * 10^4",
    acceptance: 52.1,
    likes: 1120,
    dislikes: 2100,
    examples: [{ input: "nums = [1,1,2]", output: "2" }],
    starterCode: {
      javascript: "function removeDuplicates(nums) {\n\n}",
      python: "def remove_duplicates(nums):\n    pass",
    },
    solutionCode: {},
    tags: ["Array", "Two Pointers"],
    companies: ["Microsoft", "Amazon"],
    testCases: [
      { input: "nums = [1,1,2]", output: "2" },
      { input: "nums = [0,0,1,1,1,2,2,3,3,4]", output: "5", isHidden: true },
    ],
  },
  {
    title: "Search Insert Position",
    slug: "search-insert-position",
    difficulty: Difficulty.EASY,
    description:
      "Given a sorted array of distinct integers <code>nums</code> and a <code>target</code>, return the index if found; otherwise the index where it would be inserted. Must run in O(log n).",
    constraints: "1 <= nums.length <= 10^4",
    acceptance: 43.0,
    likes: 990,
    dislikes: 45,
    examples: [{ input: "nums = [1,3,5,6], target = 5", output: "2" }],
    starterCode: {
      javascript: "function searchInsert(nums, target) {\n\n}",
      python: "def search_insert(nums, target):\n    pass",
    },
    solutionCode: {},
    tags: ["Array", "Binary Search"],
    companies: ["Amazon", "Google"],
    testCases: [
      { input: "nums = [1,3,5,6], target = 2", output: "1" },
      { input: "nums = [1,3,5,6], target = 7", output: "4", isHidden: true },
    ],
  },
  {
    title: "Plus One",
    slug: "plus-one",
    difficulty: Difficulty.EASY,
    description:
      "You are given a large integer represented as an integer array <code>digits</code>, most significant digit first. Increment the integer by one and return the resulting array of digits.",
    constraints: "1 <= digits.length <= 100\n0 <= digits[i] <= 9",
    acceptance: 44.2,
    likes: 870,
    dislikes: 1400,
    examples: [{ input: "digits = [1,2,3]", output: "[1,2,4]" }],
    starterCode: {
      javascript: "function plusOne(digits) {\n\n}",
      python: "def plus_one(digits):\n    pass",
    },
    solutionCode: {},
    tags: ["Array", "Math"],
    companies: ["Google", "Amazon"],
    testCases: [
      { input: "digits = [1,2,3]", output: "[1,2,4]" },
      { input: "digits = [9]", output: "[1,0]", isHidden: true },
    ],
  },
  {
    title: "Single Number",
    slug: "single-number",
    difficulty: Difficulty.EASY,
    description:
      "Given a non-empty array <code>nums</code> where every element appears twice except one, find that single one. Solve it with O(1) extra space.",
    constraints: "1 <= nums.length <= 3 * 10^4",
    acceptance: 70.5,
    likes: 1330,
    dislikes: 55,
    examples: [{ input: "nums = [4,1,2,1,2]", output: "4" }],
    starterCode: {
      javascript: "function singleNumber(nums) {\n\n}",
      python: "def single_number(nums):\n    pass",
    },
    solutionCode: {
      javascript:
        "function singleNumber(nums) {\n  return nums.reduce((a, b) => a ^ b, 0);\n}",
    },
    tags: ["Array", "Bit Manipulation"],
    companies: ["Amazon", "Palantir"],
    testCases: [
      { input: "nums = [2,2,1]", output: "1" },
      { input: "nums = [4,1,2,1,2]", output: "4", isHidden: true },
    ],
  },
  {
    title: "Majority Element",
    slug: "majority-element",
    difficulty: Difficulty.EASY,
    description:
      "Given an array <code>nums</code> of size n, return the majority element — the element that appears more than ⌊n / 2⌋ times.",
    constraints: "n == nums.length\n1 <= n <= 5 * 10^4",
    acceptance: 64.1,
    likes: 1210,
    dislikes: 42,
    examples: [{ input: "nums = [2,2,1,1,1,2,2]", output: "2" }],
    starterCode: {
      javascript: "function majorityElement(nums) {\n\n}",
      python: "def majority_element(nums):\n    pass",
    },
    solutionCode: {},
    tags: ["Array", "Hash Map", "Sorting"],
    companies: ["Amazon", "Adobe", "Google"],
    testCases: [
      { input: "nums = [3,2,3]", output: "3" },
      { input: "nums = [2,2,1,1,1,2,2]", output: "2", isHidden: true },
    ],
  },
  {
    title: "Move Zeroes",
    slug: "move-zeroes",
    difficulty: Difficulty.EASY,
    description:
      "Given an integer array <code>nums</code>, move all <code>0</code>'s to the end while keeping the relative order of the non-zero elements. Do it in-place.",
    constraints: "1 <= nums.length <= 10^4",
    acceptance: 61.7,
    likes: 1440,
    dislikes: 40,
    examples: [{ input: "nums = [0,1,0,3,12]", output: "[1,3,12,0,0]" }],
    starterCode: {
      javascript: "function moveZeroes(nums) {\n\n}",
      python: "def move_zeroes(nums):\n    pass",
    },
    solutionCode: {},
    tags: ["Array", "Two Pointers"],
    companies: ["Meta", "Bloomberg"],
    testCases: [
      { input: "nums = [0,1,0,3,12]", output: "[1,3,12,0,0]" },
      { input: "nums = [0]", output: "[0]", isHidden: true },
    ],
  },
  {
    title: "Intersection of Two Arrays",
    slug: "intersection-of-two-arrays",
    difficulty: Difficulty.EASY,
    description:
      "Given two integer arrays <code>nums1</code> and <code>nums2</code>, return an array of their intersection. Each element in the result must be unique, in any order.",
    constraints: "1 <= nums1.length, nums2.length <= 1000",
    acceptance: 71.2,
    likes: 640,
    dislikes: 90,
    examples: [{ input: "nums1 = [1,2,2,1], nums2 = [2,2]", output: "[2]" }],
    starterCode: {
      javascript: "function intersection(nums1, nums2) {\n\n}",
      python: "def intersection(nums1, nums2):\n    pass",
    },
    solutionCode: {
      javascript:
        "function intersection(nums1, nums2) {\n  const a = new Set(nums1);\n  return [...new Set(nums2.filter((n) => a.has(n)))];\n}",
    },
    tags: ["Array", "Hash Map"],
    companies: ["Google", "Amazon"],
    testCases: [
      { input: "nums1 = [1,2,2,1], nums2 = [2,2]", output: "[2]" },
      { input: "nums1 = [4,9,5], nums2 = [9,4,9,8,4]", output: "[9,4]", isHidden: true },
    ],
  },
  {
    title: "Fizz Buzz",
    slug: "fizz-buzz",
    difficulty: Difficulty.EASY,
    description:
      "Given an integer <code>n</code>, return a string array where each i (1-indexed) is \"FizzBuzz\" if divisible by 3 and 5, \"Fizz\" if by 3, \"Buzz\" if by 5, otherwise the number.",
    constraints: "1 <= n <= 10^4",
    acceptance: 69.9,
    likes: 520,
    dislikes: 260,
    examples: [{ input: "n = 3", output: '["1","2","Fizz"]' }],
    starterCode: {
      javascript: "function fizzBuzz(n) {\n\n}",
      python: "def fizz_buzz(n):\n    pass",
    },
    solutionCode: {},
    tags: ["Math", "String", "Simulation"],
    companies: ["Microsoft", "Amazon"],
    testCases: [{ input: "n = 5", output: '["1","2","Fizz","4","Buzz"]' }],
  },
  {
    title: "Two Sum II - Input Array Is Sorted",
    slug: "two-sum-ii-input-array-is-sorted",
    difficulty: Difficulty.MEDIUM,
    description:
      "Given a 1-indexed array <code>numbers</code> sorted in non-decreasing order, find two numbers that add up to <code>target</code> and return their 1-indexed positions. Use O(1) extra space.",
    constraints: "2 <= numbers.length <= 3 * 10^4",
    acceptance: 60.3,
    likes: 980,
    dislikes: 120,
    examples: [{ input: "numbers = [2,7,11,15], target = 9", output: "[1,2]" }],
    starterCode: {
      javascript: "function twoSum(numbers, target) {\n\n}",
      python: "def two_sum(numbers, target):\n    pass",
    },
    solutionCode: {},
    tags: ["Array", "Two Pointers", "Binary Search"],
    companies: ["Amazon", "Apple"],
    testCases: [
      { input: "numbers = [2,7,11,15], target = 9", output: "[1,2]" },
      { input: "numbers = [2,3,4], target = 6", output: "[1,3]", isHidden: true },
    ],
  },
  {
    title: "3Sum",
    slug: "3sum",
    difficulty: Difficulty.MEDIUM,
    description:
      "Given an integer array <code>nums</code>, return all unique triplets <code>[nums[i], nums[j], nums[k]]</code> such that they sum to zero.",
    constraints: "3 <= nums.length <= 3000",
    acceptance: 34.8,
    likes: 3020,
    dislikes: 290,
    examples: [{ input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]" }],
    starterCode: {
      javascript: "function threeSum(nums) {\n\n}",
      python: "def three_sum(nums):\n    pass",
    },
    solutionCode: {},
    tags: ["Array", "Two Pointers", "Sorting"],
    companies: ["Meta", "Amazon", "Adobe"],
    testCases: [
      { input: "nums = [0,1,1]", output: "[]" },
      { input: "nums = [0,0,0]", output: "[[0,0,0]]", isHidden: true },
    ],
  },
  {
    title: "Container With Most Water",
    slug: "container-with-most-water",
    difficulty: Difficulty.MEDIUM,
    description:
      "Given an integer array <code>height</code>, find two lines that together with the x-axis form a container holding the most water. Return the maximum area.",
    constraints: "2 <= height.length <= 10^5",
    acceptance: 55.6,
    likes: 2700,
    dislikes: 180,
    examples: [{ input: "height = [1,8,6,2,5,4,8,3,7]", output: "49" }],
    starterCode: {
      javascript: "function maxArea(height) {\n\n}",
      python: "def max_area(height):\n    pass",
    },
    solutionCode: {
      javascript:
        "function maxArea(height) {\n  let l = 0, r = height.length - 1, best = 0;\n  while (l < r) {\n    best = Math.max(best, Math.min(height[l], height[r]) * (r - l));\n    if (height[l] < height[r]) l++; else r--;\n  }\n  return best;\n}",
    },
    tags: ["Array", "Two Pointers", "Greedy"],
    companies: ["Amazon", "Google", "Bloomberg"],
    testCases: [
      { input: "height = [1,8,6,2,5,4,8,3,7]", output: "49" },
      { input: "height = [1,1]", output: "1", isHidden: true },
    ],
  },
  {
    title: "Rotate Image",
    slug: "rotate-image",
    difficulty: Difficulty.MEDIUM,
    description:
      "You are given an <code>n x n</code> 2D <code>matrix</code>. Rotate it 90 degrees clockwise in-place.",
    constraints: "n == matrix.length == matrix[i].length\n1 <= n <= 20",
    acceptance: 72.3,
    likes: 1600,
    dislikes: 70,
    examples: [{ input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]", output: "[[7,4,1],[8,5,2],[9,6,3]]" }],
    starterCode: {
      javascript: "function rotate(matrix) {\n\n}",
      python: "def rotate(matrix):\n    pass",
    },
    solutionCode: {},
    tags: ["Array", "Math", "Matrix"],
    companies: ["Amazon", "Microsoft", "Apple"],
    testCases: [{ input: "matrix = [[1,2],[3,4]]", output: "[[3,1],[4,2]]" }],
  },
  {
    title: "Spiral Matrix",
    slug: "spiral-matrix",
    difficulty: Difficulty.MEDIUM,
    description:
      "Given an <code>m x n</code> <code>matrix</code>, return all elements of the matrix in spiral order.",
    constraints: "1 <= m, n <= 10",
    acceptance: 47.9,
    likes: 1490,
    dislikes: 210,
    examples: [{ input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]", output: "[1,2,3,6,9,8,7,4,5]" }],
    starterCode: {
      javascript: "function spiralOrder(matrix) {\n\n}",
      python: "def spiral_order(matrix):\n    pass",
    },
    solutionCode: {},
    tags: ["Array", "Matrix", "Simulation"],
    companies: ["Amazon", "Microsoft", "Google"],
    testCases: [{ input: "matrix = [[1,2],[3,4]]", output: "[1,2,4,3]" }],
  },
  {
    title: "Set Matrix Zeroes",
    slug: "set-matrix-zeroes",
    difficulty: Difficulty.MEDIUM,
    description:
      "Given an <code>m x n</code> integer <code>matrix</code>, if an element is 0, set its entire row and column to 0. Do it in-place.",
    constraints: "1 <= m, n <= 200",
    acceptance: 55.1,
    likes: 1200,
    dislikes: 120,
    examples: [{ input: "matrix = [[1,1,1],[1,0,1],[1,1,1]]", output: "[[1,0,1],[0,0,0],[1,0,1]]" }],
    starterCode: {
      javascript: "function setZeroes(matrix) {\n\n}",
      python: "def set_zeroes(matrix):\n    pass",
    },
    solutionCode: {},
    tags: ["Array", "Hash Map", "Matrix"],
    companies: ["Amazon", "Microsoft"],
    testCases: [{ input: "matrix = [[0,1],[1,1]]", output: "[[0,0],[0,1]]" }],
  },
  {
    title: "Word Search",
    slug: "word-search",
    difficulty: Difficulty.MEDIUM,
    description:
      "Given an <code>m x n</code> grid of characters <code>board</code> and a string <code>word</code>, return <code>true</code> if the word exists in the grid via sequentially adjacent cells.",
    constraints: "1 <= m, n <= 6\n1 <= word.length <= 15",
    acceptance: 42.0,
    likes: 2100,
    dislikes: 95,
    examples: [{ input: 'board = [["A","B"],["C","D"]], word = "ABDC"', output: "true" }],
    starterCode: {
      javascript: "function exist(board, word) {\n\n}",
      python: "def exist(board, word):\n    pass",
    },
    solutionCode: {},
    tags: ["Array", "Backtracking", "Matrix"],
    companies: ["Amazon", "Microsoft", "Bloomberg"],
    testCases: [{ input: 'board = [["A","B"],["C","D"]], word = "ABDC"', output: "true" }],
  },
  {
    title: "Top K Frequent Elements",
    slug: "top-k-frequent-elements",
    difficulty: Difficulty.MEDIUM,
    description:
      "Given an integer array <code>nums</code> and an integer <code>k</code>, return the <code>k</code> most frequent elements, in any order.",
    constraints: "1 <= nums.length <= 10^5\n1 <= k <= number of unique elements",
    acceptance: 63.4,
    likes: 1900,
    dislikes: 90,
    examples: [{ input: "nums = [1,1,1,2,2,3], k = 2", output: "[1,2]" }],
    starterCode: {
      javascript: "function topKFrequent(nums, k) {\n\n}",
      python: "def top_k_frequent(nums, k):\n    pass",
    },
    solutionCode: {},
    tags: ["Array", "Hash Map", "Heap"],
    companies: ["Amazon", "Facebook", "Yelp"],
    testCases: [
      { input: "nums = [1,1,1,2,2,3], k = 2", output: "[1,2]" },
      { input: "nums = [1], k = 1", output: "[1]", isHidden: true },
    ],
  },
  {
    title: "Sqrt(x)",
    slug: "sqrtx",
    difficulty: Difficulty.EASY,
    description:
      "Given a non-negative integer <code>x</code>, return the square root of <code>x</code> rounded down to the nearest integer, computed without built-in exponent functions.",
    constraints: "0 <= x <= 2^31 - 1",
    acceptance: 38.6,
    likes: 760,
    dislikes: 900,
    examples: [{ input: "x = 8", output: "2", explanation: "sqrt(8) = 2.82..., rounded down is 2." }],
    starterCode: {
      javascript: "function mySqrt(x) {\n\n}",
      python: "def my_sqrt(x):\n    pass",
    },
    solutionCode: {
      javascript:
        "function mySqrt(x) {\n  let lo = 0, hi = x, ans = 0;\n  while (lo <= hi) {\n    const m = (lo + hi) >> 1;\n    if (m * m <= x) { ans = m; lo = m + 1; } else hi = m - 1;\n  }\n  return ans;\n}",
    },
    tags: ["Math", "Binary Search"],
    companies: ["Bloomberg", "Amazon"],
    testCases: [
      { input: "x = 4", output: "2" },
      { input: "x = 8", output: "2", isHidden: true },
    ],
  },
  {
    title: "Length of Last Word",
    slug: "length-of-last-word",
    difficulty: Difficulty.EASY,
    description:
      "Given a string <code>s</code> of words separated by spaces, return the length of the last word.",
    constraints: "1 <= s.length <= 10^4",
    acceptance: 46.8,
    likes: 610,
    dislikes: 380,
    examples: [{ input: 's = "Hello World"', output: "5" }],
    starterCode: {
      javascript: "function lengthOfLastWord(s) {\n\n}",
      python: "def length_of_last_word(s):\n    pass",
    },
    solutionCode: {
      javascript:
        "function lengthOfLastWord(s) {\n  return s.trim().split(' ').pop().length;\n}",
    },
    tags: ["String"],
    companies: ["Amazon"],
    testCases: [
      { input: 's = "   fly me   to   the moon  "', output: "4" },
      { input: 's = "luffy is still joyboy"', output: "6", isHidden: true },
    ],
  },
  {
    title: "Best Time to Buy and Sell Stock II",
    slug: "best-time-to-buy-and-sell-stock-ii",
    difficulty: Difficulty.MEDIUM,
    description:
      "Given daily <code>prices</code>, you may buy and sell as many times as you like (holding at most one share at a time). Return the maximum total profit you can achieve.",
    constraints: "1 <= prices.length <= 3 * 10^4\n0 <= prices[i] <= 10^4",
    acceptance: 65.1,
    likes: 1420,
    dislikes: 70,
    examples: [
      { input: "prices = [7,1,5,3,6,4]", output: "7", explanation: "Buy at 1 sell at 5, buy at 3 sell at 6." },
    ],
    starterCode: {
      javascript: "function maxProfit(prices) {\n\n}",
      python: "def max_profit(prices):\n    pass",
    },
    solutionCode: {},
    tags: ["Array", "Greedy", "Dynamic Programming"],
    companies: ["Amazon", "Bloomberg"],
    testCases: [
      { input: "prices = [7,1,5,3,6,4]", output: "7" },
      { input: "prices = [7,6,4,3,1]", output: "0", isHidden: true },
    ],
  },
  {
    title: "Valid Palindrome",
    slug: "valid-palindrome",
    difficulty: Difficulty.EASY,
    description:
      "A phrase is a palindrome if, after lowercasing and removing every non-alphanumeric character, it reads the same forwards and backwards. Given a string <code>s</code>, return whether it is a palindrome.",
    constraints: "1 <= s.length <= 2 * 10^5",
    acceptance: 45.2,
    likes: 1180,
    dislikes: 150,
    examples: [
      { input: 's = "A man, a plan, a canal: Panama"', output: "true", explanation: '"amanaplanacanalpanama" reads the same both ways.' },
    ],
    starterCode: {
      javascript: "function isPalindrome(s) {\n\n}",
      python: "def is_palindrome(s):\n    pass",
    },
    solutionCode: {},
    tags: ["String", "Two Pointers"],
    companies: ["Meta", "Microsoft"],
    testCases: [
      { input: 's = "A man, a plan, a canal: Panama"', output: "true" },
      { input: 's = "race a car"', output: "false", isHidden: true },
    ],
  },
  {
    title: "Merge Sorted Array",
    slug: "merge-sorted-array",
    difficulty: Difficulty.EASY,
    description:
      "You are given two sorted arrays <code>nums1</code> (with m real values followed by n zeros) and <code>nums2</code> (n values). Merge <code>nums2</code> into <code>nums1</code> in place so the result stays sorted.",
    constraints: "nums1.length == m + n\n0 <= m, n <= 200",
    acceptance: 48.6,
    likes: 940,
    dislikes: 210,
    examples: [
      { input: "nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3", output: "[1,2,2,3,5,6]" },
    ],
    starterCode: {
      javascript: "function merge(nums1, m, nums2, n) {\n\n}",
      python: "def merge(nums1, m, nums2, n):\n    pass",
    },
    solutionCode: {},
    tags: ["Array", "Two Pointers", "Sorting"],
    companies: ["Meta", "Microsoft", "Amazon"],
    testCases: [
      { input: "nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3", output: "[1,2,2,3,5,6]" },
    ],
  },
  {
    title: "Linked List Cycle",
    slug: "linked-list-cycle",
    difficulty: Difficulty.EASY,
    description:
      "Given the <code>head</code> of a linked list, return <code>true</code> if the list contains a cycle — that is, some node can be reached again by continuously following <code>next</code>.",
    constraints: "The number of nodes is in the range [0, 10^4].",
    acceptance: 50.3,
    likes: 1600,
    dislikes: 130,
    examples: [{ input: "head = [3,2,0,-4], pos = 1", output: "true" }],
    starterCode: {
      javascript: "function hasCycle(head) {\n\n}",
      python: "def has_cycle(head):\n    pass",
    },
    solutionCode: {},
    tags: ["Linked List", "Two Pointers"],
    companies: ["Amazon", "Microsoft", "Bloomberg"],
    testCases: [
      { input: "head = [3,2,0,-4], pos = 1", output: "true" },
      { input: "head = [1], pos = -1", output: "false", isHidden: true },
    ],
  },
  {
    title: "Invert Binary Tree",
    slug: "invert-binary-tree",
    difficulty: Difficulty.EASY,
    description:
      "Given the <code>root</code> of a binary tree, swap every node's left and right child and return the root.",
    constraints: "The number of nodes is in the range [0, 100].",
    acceptance: 76.4,
    likes: 1520,
    dislikes: 40,
    examples: [{ input: "root = [4,2,7,1,3,6,9]", output: "[4,7,2,9,6,3,1]" }],
    starterCode: {
      javascript: "function invertTree(root) {\n\n}",
      python: "def invert_tree(root):\n    pass",
    },
    solutionCode: {},
    tags: ["Tree", "Depth-First Search", "Recursion"],
    companies: ["Google", "Amazon"],
    testCases: [{ input: "root = [2,1,3]", output: "[2,3,1]" }],
  },
  {
    title: "Maximum Depth of Binary Tree",
    slug: "maximum-depth-of-binary-tree",
    difficulty: Difficulty.EASY,
    description:
      "Return the maximum depth of a binary tree — the number of nodes along the longest path from the root down to the furthest leaf.",
    constraints: "The number of nodes is in the range [0, 10^4].",
    acceptance: 74.8,
    likes: 1210,
    dislikes: 35,
    examples: [{ input: "root = [3,9,20,null,null,15,7]", output: "3" }],
    starterCode: {
      javascript: "function maxDepth(root) {\n\n}",
      python: "def max_depth(root):\n    pass",
    },
    solutionCode: {},
    tags: ["Tree", "Depth-First Search", "Recursion"],
    companies: ["Google", "LinkedIn"],
    testCases: [{ input: "root = [1,null,2]", output: "2" }],
  },
  {
    title: "Same Tree",
    slug: "same-tree",
    difficulty: Difficulty.EASY,
    description:
      "Given the roots of two binary trees <code>p</code> and <code>q</code>, return whether they are structurally identical and have the same values at every node.",
    constraints: "The number of nodes in each tree is in the range [0, 100].",
    acceptance: 59.7,
    likes: 780,
    dislikes: 60,
    examples: [{ input: "p = [1,2,3], q = [1,2,3]", output: "true" }],
    starterCode: {
      javascript: "function isSameTree(p, q) {\n\n}",
      python: "def is_same_tree(p, q):\n    pass",
    },
    solutionCode: {},
    tags: ["Tree", "Depth-First Search", "Recursion"],
    companies: ["Amazon", "Apple"],
    testCases: [
      { input: "p = [1,2], q = [1,null,2]", output: "false", isHidden: true },
    ],
  },
  {
    title: "Balanced Binary Tree",
    slug: "balanced-binary-tree",
    difficulty: Difficulty.EASY,
    description:
      "A binary tree is height-balanced when, for every node, the depths of its two subtrees differ by at most one. Given the <code>root</code>, return whether the tree is balanced.",
    constraints: "The number of nodes is in the range [0, 5000].",
    acceptance: 51.4,
    likes: 820,
    dislikes: 90,
    examples: [{ input: "root = [3,9,20,null,null,15,7]", output: "true" }],
    starterCode: {
      javascript: "function isBalanced(root) {\n\n}",
      python: "def is_balanced(root):\n    pass",
    },
    solutionCode: {},
    tags: ["Tree", "Depth-First Search", "Recursion"],
    companies: ["Amazon", "Bloomberg"],
    testCases: [{ input: "root = [1,2,2,3,3,null,null,4,4]", output: "false" }],
  },
  {
    title: "Binary Tree Level Order Traversal",
    slug: "binary-tree-level-order-traversal",
    difficulty: Difficulty.MEDIUM,
    description:
      "Given the <code>root</code> of a binary tree, return its node values grouped level by level, from left to right.",
    constraints: "The number of nodes is in the range [0, 2000].",
    acceptance: 66.2,
    likes: 1340,
    dislikes: 40,
    examples: [
      { input: "root = [3,9,20,null,null,15,7]", output: "[[3],[9,20],[15,7]]" },
    ],
    starterCode: {
      javascript: "function levelOrder(root) {\n\n}",
      python: "def level_order(root):\n    pass",
    },
    solutionCode: {},
    tags: ["Tree", "Breadth-First Search"],
    companies: ["Amazon", "Microsoft", "Meta"],
    testCases: [{ input: "root = [1]", output: "[[1]]" }],
  },
  {
    title: "Validate Binary Search Tree",
    slug: "validate-binary-search-tree",
    difficulty: Difficulty.MEDIUM,
    description:
      "Determine whether a binary tree is a valid binary search tree: every node in a left subtree is strictly smaller than its ancestor, and every node in a right subtree is strictly larger.",
    constraints: "The number of nodes is in the range [1, 10^4].",
    acceptance: 33.1,
    likes: 1690,
    dislikes: 180,
    examples: [
      { input: "root = [5,1,4,null,null,3,6]", output: "false", explanation: "4 is in the right subtree of 5 but 3 < 5." },
    ],
    starterCode: {
      javascript: "function isValidBST(root) {\n\n}",
      python: "def is_valid_bst(root):\n    pass",
    },
    solutionCode: {},
    tags: ["Tree", "Depth-First Search", "Binary Search Tree"],
    companies: ["Amazon", "Meta", "Microsoft"],
    testCases: [{ input: "root = [2,1,3]", output: "true" }],
  },
  {
    title: "Lowest Common Ancestor of a BST",
    slug: "lowest-common-ancestor-of-a-bst",
    difficulty: Difficulty.MEDIUM,
    description:
      "Given a binary search tree and two nodes <code>p</code> and <code>q</code>, return their lowest common ancestor — the deepest node that has both as descendants.",
    constraints: "The number of nodes is in the range [2, 10^5].",
    acceptance: 63.8,
    likes: 1050,
    dislikes: 50,
    examples: [{ input: "root = [6,2,8,0,4,7,9], p = 2, q = 8", output: "6" }],
    starterCode: {
      javascript: "function lowestCommonAncestor(root, p, q) {\n\n}",
      python: "def lowest_common_ancestor(root, p, q):\n    pass",
    },
    solutionCode: {},
    tags: ["Tree", "Binary Search Tree", "Depth-First Search"],
    companies: ["Meta", "Amazon", "LinkedIn"],
    testCases: [{ input: "root = [2,1], p = 2, q = 1", output: "2" }],
  },
  {
    title: "Implement Queue using Stacks",
    slug: "implement-queue-using-stacks",
    difficulty: Difficulty.EASY,
    description:
      "Implement a first-in-first-out queue using only two stacks. Support <code>push</code>, <code>pop</code>, <code>peek</code> and <code>empty</code>.",
    constraints: "At most 100 calls will be made to each operation.",
    acceptance: 66.9,
    likes: 730,
    dislikes: 45,
    examples: [
      { input: 'push(1), push(2), peek(), pop(), empty()', output: "[null,null,1,1,false]" },
    ],
    starterCode: {
      javascript: "class MyQueue {\n  constructor() {\n\n  }\n}",
      python: "class MyQueue:\n    def __init__(self):\n        pass",
    },
    solutionCode: {},
    tags: ["Stack", "Queue", "Design"],
    companies: ["Microsoft", "Bloomberg"],
    testCases: [{ input: "push(1), push(2), peek()", output: "1" }],
  },
  {
    title: "Min Stack",
    slug: "min-stack",
    difficulty: Difficulty.MEDIUM,
    description:
      "Design a stack that supports <code>push</code>, <code>pop</code>, <code>top</code> and retrieving the minimum element — all in constant time.",
    constraints: "At most 3 * 10^4 calls will be made.",
    acceptance: 54.7,
    likes: 1420,
    dislikes: 90,
    examples: [
      { input: "push(-2), push(0), push(-3), getMin()", output: "-3" },
    ],
    starterCode: {
      javascript: "class MinStack {\n  constructor() {\n\n  }\n}",
      python: "class MinStack:\n    def __init__(self):\n        pass",
    },
    solutionCode: {},
    tags: ["Stack", "Design"],
    companies: ["Amazon", "Bloomberg", "Google"],
    testCases: [{ input: "push(-2), push(0), push(-3), getMin()", output: "-3" }],
  },
  {
    title: "Longest Palindromic Substring",
    slug: "longest-palindromic-substring",
    difficulty: Difficulty.MEDIUM,
    description:
      "Given a string <code>s</code>, return the longest substring of <code>s</code> that is a palindrome.",
    constraints: "1 <= s.length <= 1000",
    acceptance: 34.6,
    likes: 2810,
    dislikes: 170,
    examples: [
      { input: 's = "babad"', output: '"bab"', explanation: '"aba" is also a valid answer.' },
    ],
    starterCode: {
      javascript: "function longestPalindrome(s) {\n\n}",
      python: "def longest_palindrome(s):\n    pass",
    },
    solutionCode: {},
    tags: ["String", "Dynamic Programming", "Two Pointers"],
    companies: ["Amazon", "Microsoft", "Adobe"],
    testCases: [{ input: 's = "cbbd"', output: '"bb"' }],
  },
  {
    title: "House Robber",
    slug: "house-robber",
    difficulty: Difficulty.MEDIUM,
    description:
      "Each house on a street holds some money, but robbing two adjacent houses triggers the alarm. Given <code>nums</code>, return the maximum amount you can rob tonight.",
    constraints: "1 <= nums.length <= 100\n0 <= nums[i] <= 400",
    acceptance: 50.8,
    likes: 1980,
    dislikes: 60,
    examples: [
      { input: "nums = [2,7,9,3,1]", output: "12", explanation: "Rob houses 1, 3 and 5 (2 + 9 + 1)." },
    ],
    starterCode: {
      javascript: "function rob(nums) {\n\n}",
      python: "def rob(nums):\n    pass",
    },
    solutionCode: {},
    tags: ["Array", "Dynamic Programming"],
    companies: ["Amazon", "Google", "Adobe"],
    testCases: [
      { input: "nums = [1,2,3,1]", output: "4" },
      { input: "nums = [2,7,9,3,1]", output: "12", isHidden: true },
    ],
  },
  {
    title: "Unique Paths",
    slug: "unique-paths",
    difficulty: Difficulty.MEDIUM,
    description:
      "A robot starts at the top-left of an <code>m x n</code> grid and may only move right or down. Return how many distinct paths reach the bottom-right corner.",
    constraints: "1 <= m, n <= 100",
    acceptance: 63.5,
    likes: 1560,
    dislikes: 55,
    examples: [{ input: "m = 3, n = 7", output: "28" }],
    starterCode: {
      javascript: "function uniquePaths(m, n) {\n\n}",
      python: "def unique_paths(m, n):\n    pass",
    },
    solutionCode: {},
    tags: ["Dynamic Programming", "Math", "Matrix"],
    companies: ["Amazon", "Google", "Bloomberg"],
    testCases: [{ input: "m = 3, n = 2", output: "3" }],
  },
  {
    title: "Jump Game",
    slug: "jump-game",
    difficulty: Difficulty.MEDIUM,
    description:
      "Each element of <code>nums</code> is the maximum jump length from that position. Starting at index 0, return whether you can reach the last index.",
    constraints: "1 <= nums.length <= 10^4",
    acceptance: 38.9,
    likes: 1780,
    dislikes: 110,
    examples: [
      { input: "nums = [2,3,1,1,4]", output: "true", explanation: "Jump 1 step to index 1, then 3 to the end." },
    ],
    starterCode: {
      javascript: "function canJump(nums) {\n\n}",
      python: "def can_jump(nums):\n    pass",
    },
    solutionCode: {},
    tags: ["Array", "Greedy", "Dynamic Programming"],
    companies: ["Amazon", "Meta", "Microsoft"],
    testCases: [
      { input: "nums = [2,3,1,1,4]", output: "true" },
      { input: "nums = [3,2,1,0,4]", output: "false", isHidden: true },
    ],
  },
  {
    title: "Merge Intervals",
    slug: "merge-intervals",
    difficulty: Difficulty.MEDIUM,
    description:
      "Given a list of <code>intervals</code>, merge every set of overlapping intervals and return the resulting non-overlapping list.",
    constraints: "1 <= intervals.length <= 10^4",
    acceptance: 47.3,
    likes: 2240,
    dislikes: 80,
    examples: [
      { input: "intervals = [[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]" },
    ],
    starterCode: {
      javascript: "function merge(intervals) {\n\n}",
      python: "def merge(intervals):\n    pass",
    },
    solutionCode: {},
    tags: ["Array", "Sorting"],
    companies: ["Meta", "Amazon", "Google"],
    testCases: [{ input: "intervals = [[1,4],[4,5]]", output: "[[1,5]]" }],
  },
  {
    title: "Longest Consecutive Sequence",
    slug: "longest-consecutive-sequence",
    difficulty: Difficulty.MEDIUM,
    description:
      "Given an unsorted array <code>nums</code>, return the length of the longest run of consecutive integers it contains. Aim for O(n) time.",
    constraints: "0 <= nums.length <= 10^5",
    acceptance: 46.1,
    likes: 1870,
    dislikes: 90,
    examples: [
      { input: "nums = [100,4,200,1,3,2]", output: "4", explanation: "The run [1,2,3,4] has length 4." },
    ],
    starterCode: {
      javascript: "function longestConsecutive(nums) {\n\n}",
      python: "def longest_consecutive(nums):\n    pass",
    },
    solutionCode: {},
    tags: ["Array", "Hash Map", "Union Find"],
    companies: ["Google", "Amazon"],
    testCases: [{ input: "nums = [0,3,7,2,5,8,4,6,0,1]", output: "9" }],
  },
  {
    title: "Subsets",
    slug: "subsets",
    difficulty: Difficulty.MEDIUM,
    description:
      "Given an array of distinct integers <code>nums</code>, return every possible subset (the power set), in any order.",
    constraints: "1 <= nums.length <= 10",
    acceptance: 76.2,
    likes: 1490,
    dislikes: 45,
    examples: [
      { input: "nums = [1,2,3]", output: "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]" },
    ],
    starterCode: {
      javascript: "function subsets(nums) {\n\n}",
      python: "def subsets(nums):\n    pass",
    },
    solutionCode: {},
    tags: ["Array", "Backtracking", "Bit Manipulation"],
    companies: ["Meta", "Amazon"],
    testCases: [{ input: "nums = [0]", output: "[[],[0]]" }],
  },
  {
    title: "Permutations",
    slug: "permutations",
    difficulty: Difficulty.MEDIUM,
    description:
      "Given an array of distinct integers <code>nums</code>, return all possible orderings of its elements.",
    constraints: "1 <= nums.length <= 6",
    acceptance: 77.4,
    likes: 1360,
    dislikes: 35,
    examples: [
      { input: "nums = [1,2,3]", output: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]" },
    ],
    starterCode: {
      javascript: "function permute(nums) {\n\n}",
      python: "def permute(nums):\n    pass",
    },
    solutionCode: {},
    tags: ["Array", "Backtracking"],
    companies: ["Amazon", "Microsoft", "LinkedIn"],
    testCases: [{ input: "nums = [0,1]", output: "[[0,1],[1,0]]" }],
  },
  {
    title: "Kth Largest Element in an Array",
    slug: "kth-largest-element-in-an-array",
    difficulty: Difficulty.MEDIUM,
    description:
      "Return the <code>k</code>th largest element in <code>nums</code>. This is the kth largest in sorted order, not the kth distinct value.",
    constraints: "1 <= k <= nums.length <= 10^5",
    acceptance: 67.0,
    likes: 1720,
    dislikes: 95,
    examples: [{ input: "nums = [3,2,1,5,6,4], k = 2", output: "5" }],
    starterCode: {
      javascript: "function findKthLargest(nums, k) {\n\n}",
      python: "def find_kth_largest(nums, k):\n    pass",
    },
    solutionCode: {},
    tags: ["Array", "Heap", "Sorting"],
    companies: ["Meta", "Amazon", "Microsoft"],
    testCases: [
      { input: "nums = [3,2,3,1,2,4,5,5,6], k = 4", output: "4", isHidden: true },
    ],
  },
  {
    title: "Climbing Stairs II - Min Cost",
    slug: "min-cost-climbing-stairs",
    difficulty: Difficulty.EASY,
    description:
      "Each index of <code>cost</code> charges a fee to step off it. You may climb one or two steps at a time and can start at index 0 or 1. Return the cheapest way to reach the top.",
    constraints: "2 <= cost.length <= 1000",
    acceptance: 62.4,
    likes: 890,
    dislikes: 40,
    examples: [
      { input: "cost = [10,15,20]", output: "15", explanation: "Start at index 1 and jump straight to the top." },
    ],
    starterCode: {
      javascript: "function minCostClimbingStairs(cost) {\n\n}",
      python: "def min_cost_climbing_stairs(cost):\n    pass",
    },
    solutionCode: {},
    tags: ["Array", "Dynamic Programming"],
    companies: ["Amazon", "Adobe"],
    testCases: [
      { input: "cost = [1,100,1,1,1,100,1,1,100,1]", output: "6", isHidden: true },
    ],
  },
  {
    title: "Ransom Note",
    slug: "ransom-note",
    difficulty: Difficulty.EASY,
    description:
      "Given <code>ransomNote</code> and <code>magazine</code>, return whether the note can be built using each letter of the magazine at most once.",
    constraints: "1 <= ransomNote.length, magazine.length <= 10^5",
    acceptance: 59.8,
    likes: 640,
    dislikes: 70,
    examples: [{ input: 'ransomNote = "aa", magazine = "aab"', output: "true" }],
    starterCode: {
      javascript: "function canConstruct(ransomNote, magazine) {\n\n}",
      python: "def can_construct(ransom_note, magazine):\n    pass",
    },
    solutionCode: {},
    tags: ["Hash Map", "String", "Counting"],
    companies: ["Amazon", "Apple"],
    testCases: [
      { input: 'ransomNote = "a", magazine = "b"', output: "false", isHidden: true },
    ],
  },
  {
    title: "First Unique Character in a String",
    slug: "first-unique-character-in-a-string",
    difficulty: Difficulty.EASY,
    description:
      "Given a string <code>s</code>, return the index of the first character that appears exactly once, or <code>-1</code> if there is none.",
    constraints: "1 <= s.length <= 10^5\ns consists of lowercase English letters.",
    acceptance: 60.1,
    likes: 720,
    dislikes: 55,
    examples: [{ input: 's = "leetcode"', output: "0" }],
    starterCode: {
      javascript: "function firstUniqChar(s) {\n\n}",
      python: "def first_uniq_char(s):\n    pass",
    },
    solutionCode: {},
    tags: ["Hash Map", "String", "Queue"],
    companies: ["Amazon", "Bloomberg", "Microsoft"],
    testCases: [
      { input: 's = "loveleetcode"', output: "2" },
      { input: 's = "aabb"', output: "-1", isHidden: true },
    ],
  },
  {
    // Authored through the admin editor originally, which left empty
    // <p><br></p> spacers and a duplicated markdown example block in the
    // description. Managed here now so the seed keeps it clean.
    title: "Armstrong Number",
    slug: "armstrong-number",
    difficulty: Difficulty.EASY,
    description:
      "Given a positive integer <code>n</code>, determine whether it is an Armstrong number — a number equal to the sum of its own digits, each raised to the power of the number of digits. Return <code>true</code> if it is, and <code>false</code> otherwise.",
    constraints: "1 <= n <= 10^9",
    acceptance: 68.0,
    likes: 540,
    dislikes: 30,
    examples: [
      {
        input: "n = 153",
        output: "true",
        explanation: "153 has 3 digits, and 1³ + 5³ + 3³ = 1 + 125 + 27 = 153.",
      },
      {
        input: "n = 9474",
        output: "true",
        explanation: "9⁴ + 4⁴ + 7⁴ + 4⁴ = 9474.",
      },
      { input: "n = 10", output: "false" },
    ],
    starterCode: {
      javascript: "function isArmstrong(n) {\n\n}",
      python: "def is_armstrong(n):\n    pass",
    },
    solutionCode: {},
    tags: ["Math", "Number Theory"],
    companies: ["Adobe", "Infosys", "TCS"],
    testCases: [
      { input: "n = 153", output: "true" },
      { input: "n = 9474", output: "true" },
      { input: "n = 10", output: "false", isHidden: true },
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

  // --- Problems (additive — preserves bookmarks & votes) ---
  // Existing problems keep their number; new ones are appended after the
  // current max so we never collide with the unique `number` constraint.
  const maxAgg = await prisma.problem.aggregate({ _max: { number: true } });
  let nextNumber = maxAgg._max.number ?? 0;

  for (const raw of problems) {
    const { testCases, ...rest } = raw;

    // Reference solutions live in solutions.ts; merge them in by slug.
    const p = {
      ...rest,
      solutionCode: { ...rest.solutionCode, ...(solutions[rest.slug] ?? {}) },
    };

    const existing = await prisma.problem.findUnique({
      where: { slug: p.slug },
      select: { id: true },
    });

    const problem = existing
      ? await prisma.problem.update({
          where: { slug: p.slug },
          data: { ...p, createdById: admin.id },
        })
      : await prisma.problem.create({
          data: { ...p, number: ++nextNumber, createdById: admin.id },
        });

    // Refresh only this problem's test cases (not user data).
    await prisma.testCase.deleteMany({ where: { problemId: problem.id } });
    if (testCases.length) {
      await prisma.testCase.createMany({
        data: testCases.map((tc, idx) => ({
          problemId: problem.id,
          input: tc.input,
          output: tc.output,
          isHidden: tc.isHidden ?? false,
          order: idx,
        })),
      });
    }
  }

  console.log(
    `✅ Seed completed: ${problems.length} problems upserted (users, bookmarks & votes preserved)`
  );
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
