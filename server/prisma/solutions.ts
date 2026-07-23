/**
 * Reference solutions keyed by problem slug, merged into each problem's
 * `solutionCode` at seed time. Kept separate from the problem metadata so
 * the code stays readable (real newlines instead of escaped strings).
 */
export const solutions: Record<string, Record<string, string>> = {
  "add-two-numbers": {
    javascript: `function addTwoNumbers(l1, l2) {
  const dummy = { val: 0, next: null };
  let cur = dummy;
  let carry = 0;

  while (l1 || l2 || carry) {
    const sum = (l1?.val ?? 0) + (l2?.val ?? 0) + carry;
    carry = Math.floor(sum / 10);
    cur.next = { val: sum % 10, next: null };
    cur = cur.next;
    l1 = l1?.next ?? null;
    l2 = l2?.next ?? null;
  }

  return dummy.next;
}`,
  },

  "course-schedule": {
    javascript: `function canFinish(numCourses, prerequisites) {
  const graph = Array.from({ length: numCourses }, () => []);
  const indegree = new Array(numCourses).fill(0);

  for (const [course, pre] of prerequisites) {
    graph[pre].push(course);
    indegree[course]++;
  }

  const queue = [];
  for (let i = 0; i < numCourses; i++) {
    if (indegree[i] === 0) queue.push(i);
  }

  let visited = 0;
  while (queue.length) {
    const node = queue.shift();
    visited++;
    for (const next of graph[node]) {
      if (--indegree[next] === 0) queue.push(next);
    }
  }

  // Every course scheduled means the graph had no cycle.
  return visited === numCourses;
}`,
  },

  "merge-k-sorted-lists": {
    javascript: `function mergeKLists(lists) {
  const values = [];

  for (const list of lists) {
    let node = list;
    while (node) {
      values.push(node.val);
      node = node.next;
    }
  }

  values.sort((a, b) => a - b);

  const dummy = { val: 0, next: null };
  let cur = dummy;
  for (const value of values) {
    cur.next = { val: value, next: null };
    cur = cur.next;
  }

  return dummy.next;
}`,
  },

  "median-of-two-sorted-arrays": {
    javascript: `function findMedianSortedArrays(nums1, nums2) {
  const merged = [...nums1, ...nums2].sort((a, b) => a - b);
  const mid = Math.floor(merged.length / 2);

  return merged.length % 2 === 0
    ? (merged[mid - 1] + merged[mid]) / 2
    : merged[mid];
}`,
  },

  "merge-two-sorted-lists": {
    javascript: `function mergeTwoLists(list1, list2) {
  const dummy = { val: 0, next: null };
  let cur = dummy;

  while (list1 && list2) {
    if (list1.val <= list2.val) {
      cur.next = list1;
      list1 = list1.next;
    } else {
      cur.next = list2;
      list2 = list2.next;
    }
    cur = cur.next;
  }

  cur.next = list1 ?? list2;
  return dummy.next;
}`,
  },

  "reverse-linked-list": {
    javascript: `function reverseList(head) {
  let prev = null;

  while (head) {
    const next = head.next;
    head.next = prev;
    prev = head;
    head = next;
  }

  return prev;
}`,
  },

  "number-of-islands": {
    javascript: `function numIslands(grid) {
  if (!grid.length) return 0;

  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;

  // Flood-fill each island so it is only counted once.
  function sink(r, c) {
    if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] !== "1") return;
    grid[r][c] = "0";
    sink(r + 1, c);
    sink(r - 1, c);
    sink(r, c + 1);
    sink(r, c - 1);
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === "1") {
        count++;
        sink(r, c);
      }
    }
  }

  return count;
}`,
  },

  "roman-to-integer": {
    javascript: `function romanToInt(s) {
  const map = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;

  for (let i = 0; i < s.length; i++) {
    const cur = map[s[i]];
    const next = map[s[i + 1]];
    // A smaller numeral before a larger one is subtracted (IV, IX, ...).
    total += next > cur ? -cur : cur;
  }

  return total;
}`,
  },

  "longest-common-prefix": {
    javascript: `function longestCommonPrefix(strs) {
  if (!strs.length) return "";

  let prefix = strs[0];
  for (const s of strs.slice(1)) {
    while (!s.startsWith(prefix)) {
      prefix = prefix.slice(0, -1);
      if (!prefix) return "";
    }
  }

  return prefix;
}`,
  },

  "remove-duplicates-from-sorted-array": {
    javascript: `function removeDuplicates(nums) {
  let k = 0;

  for (let i = 0; i < nums.length; i++) {
    if (i === 0 || nums[i] !== nums[i - 1]) {
      nums[k++] = nums[i];
    }
  }

  return k;
}`,
  },

  "search-insert-position": {
    javascript: `function searchInsert(nums, target) {
  let lo = 0;
  let hi = nums.length;

  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid;
  }

  return lo;
}`,
  },

  "plus-one": {
    javascript: `function plusOne(digits) {
  for (let i = digits.length - 1; i >= 0; i--) {
    if (digits[i] < 9) {
      digits[i]++;
      return digits;
    }
    digits[i] = 0;
  }

  // Every digit was a 9 (e.g. 999 -> 1000).
  return [1, ...digits];
}`,
  },

  "majority-element": {
    javascript: `function majorityElement(nums) {
  // Boyer-Moore voting: the majority survives every cancellation.
  let count = 0;
  let candidate = null;

  for (const n of nums) {
    if (count === 0) candidate = n;
    count += n === candidate ? 1 : -1;
  }

  return candidate;
}`,
  },

  "move-zeroes": {
    javascript: `function moveZeroes(nums) {
  let insert = 0;

  for (const n of nums) {
    if (n !== 0) nums[insert++] = n;
  }

  while (insert < nums.length) {
    nums[insert++] = 0;
  }

  return nums;
}`,
  },

  "fizz-buzz": {
    javascript: `function fizzBuzz(n) {
  const out = [];

  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) out.push("FizzBuzz");
    else if (i % 3 === 0) out.push("Fizz");
    else if (i % 5 === 0) out.push("Buzz");
    else out.push(String(i));
  }

  return out;
}`,
  },

  "two-sum-ii-input-array-is-sorted": {
    javascript: `function twoSum(numbers, target) {
  let lo = 0;
  let hi = numbers.length - 1;

  while (lo < hi) {
    const sum = numbers[lo] + numbers[hi];
    if (sum === target) return [lo + 1, hi + 1];
    if (sum < target) lo++;
    else hi--;
  }

  return [];
}`,
  },

  "3sum": {
    javascript: `function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const res = [];

  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;

    let lo = i + 1;
    let hi = nums.length - 1;

    while (lo < hi) {
      const sum = nums[i] + nums[lo] + nums[hi];
      if (sum === 0) {
        res.push([nums[i], nums[lo], nums[hi]]);
        while (lo < hi && nums[lo] === nums[lo + 1]) lo++;
        while (lo < hi && nums[hi] === nums[hi - 1]) hi--;
        lo++;
        hi--;
      } else if (sum < 0) {
        lo++;
      } else {
        hi--;
      }
    }
  }

  return res;
}`,
  },

  "rotate-image": {
    javascript: `function rotate(matrix) {
  const n = matrix.length;

  // Transpose, then reverse each row.
  for (let r = 0; r < n; r++) {
    for (let c = r + 1; c < n; c++) {
      [matrix[r][c], matrix[c][r]] = [matrix[c][r], matrix[r][c]];
    }
  }

  for (const row of matrix) row.reverse();

  return matrix;
}`,
  },

  "spiral-matrix": {
    javascript: `function spiralOrder(matrix) {
  const res = [];
  if (!matrix.length) return res;

  let top = 0;
  let bottom = matrix.length - 1;
  let left = 0;
  let right = matrix[0].length - 1;

  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) res.push(matrix[top][c]);
    top++;

    for (let r = top; r <= bottom; r++) res.push(matrix[r][right]);
    right--;

    if (top <= bottom) {
      for (let c = right; c >= left; c--) res.push(matrix[bottom][c]);
      bottom--;
    }

    if (left <= right) {
      for (let r = bottom; r >= top; r--) res.push(matrix[r][left]);
      left++;
    }
  }

  return res;
}`,
  },

  "set-matrix-zeroes": {
    javascript: `function setZeroes(matrix) {
  const rows = new Set();
  const cols = new Set();

  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[0].length; c++) {
      if (matrix[r][c] === 0) {
        rows.add(r);
        cols.add(c);
      }
    }
  }

  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[0].length; c++) {
      if (rows.has(r) || cols.has(c)) matrix[r][c] = 0;
    }
  }

  return matrix;
}`,
  },

  "word-search": {
    javascript: `function exist(board, word) {
  const rows = board.length;
  const cols = board[0].length;

  function dfs(r, c, i) {
    if (i === word.length) return true;
    if (r < 0 || c < 0 || r >= rows || c >= cols) return false;
    if (board[r][c] !== word[i]) return false;

    const ch = board[r][c];
    board[r][c] = "#"; // mark visited for this path
    const found =
      dfs(r + 1, c, i + 1) ||
      dfs(r - 1, c, i + 1) ||
      dfs(r, c + 1, i + 1) ||
      dfs(r, c - 1, i + 1);
    board[r][c] = ch;

    return found;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (dfs(r, c, 0)) return true;
    }
  }

  return false;
}`,
  },

  "top-k-frequent-elements": {
    javascript: `function topKFrequent(nums, k) {
  const counts = new Map();
  for (const n of nums) counts.set(n, (counts.get(n) ?? 0) + 1);

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)
    .map(([value]) => value);
}`,
  },

  "armstrong-number": {
    javascript: `function isArmstrong(n) {
  const digits = String(n);
  const power = digits.length;

  let sum = 0;
  for (const d of digits) sum += Number(d) ** power;

  return sum === n;
}`,
  },

  "best-time-to-buy-and-sell-stock-ii": {
    javascript: `function maxProfit(prices) {
  // Every upward step is profit we can capture.
  let total = 0;
  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > prices[i - 1]) total += prices[i] - prices[i - 1];
  }
  return total;
}`,
  },

  "valid-palindrome": {
    javascript: `function isPalindrome(s) {
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, "");
  let lo = 0;
  let hi = clean.length - 1;

  while (lo < hi) {
    if (clean[lo] !== clean[hi]) return false;
    lo++;
    hi--;
  }
  return true;
}`,
  },

  "merge-sorted-array": {
    javascript: `function merge(nums1, m, nums2, n) {
  // Fill from the back so we never overwrite unread values.
  let i = m - 1;
  let j = n - 1;
  let k = m + n - 1;

  while (j >= 0) {
    nums1[k--] = i >= 0 && nums1[i] > nums2[j] ? nums1[i--] : nums2[j--];
  }
  return nums1;
}`,
  },

  "linked-list-cycle": {
    javascript: `function hasCycle(head) {
  // Floyd's tortoise and hare: they meet iff there is a loop.
  let slow = head;
  let fast = head;

  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`,
  },

  "invert-binary-tree": {
    javascript: `function invertTree(root) {
  if (!root) return null;

  const left = invertTree(root.left);
  root.left = invertTree(root.right);
  root.right = left;

  return root;
}`,
  },

  "maximum-depth-of-binary-tree": {
    javascript: `function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
  },

  "same-tree": {
    javascript: `function isSameTree(p, q) {
  if (!p && !q) return true;
  if (!p || !q || p.val !== q.val) return false;
  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}`,
  },

  "balanced-binary-tree": {
    javascript: `function isBalanced(root) {
  // Returns height, or -1 as soon as any subtree is unbalanced.
  function height(node) {
    if (!node) return 0;
    const l = height(node.left);
    if (l === -1) return -1;
    const r = height(node.right);
    if (r === -1) return -1;
    return Math.abs(l - r) > 1 ? -1 : 1 + Math.max(l, r);
  }

  return height(root) !== -1;
}`,
  },

  "binary-tree-level-order-traversal": {
    javascript: `function levelOrder(root) {
  if (!root) return [];

  const res = [];
  let queue = [root];

  while (queue.length) {
    res.push(queue.map((n) => n.val));
    const next = [];
    for (const n of queue) {
      if (n.left) next.push(n.left);
      if (n.right) next.push(n.right);
    }
    queue = next;
  }

  return res;
}`,
  },

  "validate-binary-search-tree": {
    javascript: `function isValidBST(root) {
  // Every node must fall inside the range its ancestors allow.
  function valid(node, low, high) {
    if (!node) return true;
    if (node.val <= low || node.val >= high) return false;
    return valid(node.left, low, node.val) && valid(node.right, node.val, high);
  }

  return valid(root, -Infinity, Infinity);
}`,
  },

  "lowest-common-ancestor-of-a-bst": {
    javascript: `function lowestCommonAncestor(root, p, q) {
  // Walk down while both targets sit on the same side.
  let node = root;
  while (node) {
    if (p.val < node.val && q.val < node.val) node = node.left;
    else if (p.val > node.val && q.val > node.val) node = node.right;
    else return node;
  }
  return null;
}`,
  },

  "implement-queue-using-stacks": {
    javascript: `class MyQueue {
  constructor() {
    this.inbox = [];
    this.outbox = [];
  }

  // Amortised O(1): each element moves between stacks at most once.
  shift() {
    if (!this.outbox.length) {
      while (this.inbox.length) this.outbox.push(this.inbox.pop());
    }
  }

  push(x) {
    this.inbox.push(x);
  }

  pop() {
    this.shift();
    return this.outbox.pop();
  }

  peek() {
    this.shift();
    return this.outbox[this.outbox.length - 1];
  }

  empty() {
    return !this.inbox.length && !this.outbox.length;
  }
}`,
  },

  "min-stack": {
    javascript: `class MinStack {
  constructor() {
    this.stack = [];
    this.mins = []; // running minimum, parallel to stack
  }

  push(val) {
    this.stack.push(val);
    this.mins.push(this.mins.length ? Math.min(val, this.getMin()) : val);
  }

  pop() {
    this.mins.pop();
    return this.stack.pop();
  }

  top() {
    return this.stack[this.stack.length - 1];
  }

  getMin() {
    return this.mins[this.mins.length - 1];
  }
}`,
  },

  "longest-palindromic-substring": {
    javascript: `function longestPalindrome(s) {
  let best = "";

  // Expand around every centre (both odd and even length).
  function expand(lo, hi) {
    while (lo >= 0 && hi < s.length && s[lo] === s[hi]) {
      lo--;
      hi++;
    }
    return s.slice(lo + 1, hi);
  }

  for (let i = 0; i < s.length; i++) {
    for (const candidate of [expand(i, i), expand(i, i + 1)]) {
      if (candidate.length > best.length) best = candidate;
    }
  }

  return best;
}`,
  },

  "house-robber": {
    javascript: `function rob(nums) {
  // prev = best up to i-2, cur = best up to i-1.
  let prev = 0;
  let cur = 0;

  for (const n of nums) {
    [prev, cur] = [cur, Math.max(cur, prev + n)];
  }

  return cur;
}`,
  },

  "unique-paths": {
    javascript: `function uniquePaths(m, n) {
  // Each cell is reachable from above + from the left.
  const row = new Array(n).fill(1);

  for (let r = 1; r < m; r++) {
    for (let c = 1; c < n; c++) row[c] += row[c - 1];
  }

  return row[n - 1];
}`,
  },

  "jump-game": {
    javascript: `function canJump(nums) {
  let reach = 0;

  for (let i = 0; i < nums.length; i++) {
    if (i > reach) return false; // stranded before this index
    reach = Math.max(reach, i + nums[i]);
  }

  return true;
}`,
  },

  "merge-intervals": {
    javascript: `function merge(intervals) {
  if (!intervals.length) return [];

  intervals.sort((a, b) => a[0] - b[0]);
  const res = [intervals[0].slice()];

  for (const [start, end] of intervals.slice(1)) {
    const last = res[res.length - 1];
    if (start <= last[1]) last[1] = Math.max(last[1], end);
    else res.push([start, end]);
  }

  return res;
}`,
  },

  "longest-consecutive-sequence": {
    javascript: `function longestConsecutive(nums) {
  const set = new Set(nums);
  let best = 0;

  for (const n of set) {
    // Only start counting from the beginning of a run.
    if (set.has(n - 1)) continue;

    let length = 1;
    while (set.has(n + length)) length++;
    best = Math.max(best, length);
  }

  return best;
}`,
  },

  "subsets": {
    javascript: `function subsets(nums) {
  const res = [[]];

  // Each new number doubles the answer set.
  for (const n of nums) {
    for (const existing of [...res]) res.push([...existing, n]);
  }

  return res;
}`,
  },

  "permutations": {
    javascript: `function permute(nums) {
  const res = [];

  function build(current, remaining) {
    if (!remaining.length) {
      res.push(current);
      return;
    }
    remaining.forEach((n, i) => {
      build([...current, n], [...remaining.slice(0, i), ...remaining.slice(i + 1)]);
    });
  }

  build([], nums);
  return res;
}`,
  },

  "kth-largest-element-in-an-array": {
    javascript: `function findKthLargest(nums, k) {
  return [...nums].sort((a, b) => b - a)[k - 1];
}`,
  },

  "min-cost-climbing-stairs": {
    javascript: `function minCostClimbingStairs(cost) {
  let one = 0; // cost to reach step i-1
  let two = 0; // cost to reach step i-2

  for (const c of cost) {
    [two, one] = [one, Math.min(one, two) + c];
  }

  return Math.min(one, two);
}`,
  },

  "ransom-note": {
    javascript: `function canConstruct(ransomNote, magazine) {
  const counts = new Map();
  for (const ch of magazine) counts.set(ch, (counts.get(ch) ?? 0) + 1);

  for (const ch of ransomNote) {
    const left = counts.get(ch) ?? 0;
    if (left === 0) return false;
    counts.set(ch, left - 1);
  }

  return true;
}`,
  },

  "first-unique-character-in-a-string": {
    javascript: `function firstUniqChar(s) {
  const counts = new Map();
  for (const ch of s) counts.set(ch, (counts.get(ch) ?? 0) + 1);

  for (let i = 0; i < s.length; i++) {
    if (counts.get(s[i]) === 1) return i;
  }

  return -1;
}`,
  },

  "trapping-rain-water": {
    javascript: `function trap(height) {
  let left = 0;
  let right = height.length - 1;
  let leftMax = 0;
  let rightMax = 0;
  let water = 0;

  // Walk inward from both ends. The shorter side is always the binding
  // constraint, so whichever wall is lower can be resolved immediately.
  while (left < right) {
    if (height[left] < height[right]) {
      leftMax = Math.max(leftMax, height[left]);
      water += leftMax - height[left];
      left++;
    } else {
      rightMax = Math.max(rightMax, height[right]);
      water += rightMax - height[right];
      right--;
    }
  }

  return water;
}`,
    python: `def trap(height):
    left, right = 0, len(height) - 1
    left_max = right_max = water = 0

    while left < right:
        if height[left] < height[right]:
            left_max = max(left_max, height[left])
            water += left_max - height[left]
            left += 1
        else:
            right_max = max(right_max, height[right])
            water += right_max - height[right]
            right -= 1

    return water`,
  },

  "merge-k-sorted-lists": {
    javascript: `function mergeKLists(lists) {
  if (!lists.length) return null;

  // Pair up and merge repeatedly: O(n log k) instead of merging one at a
  // time into an ever-growing accumulator.
  const mergeTwo = (a, b) => {
    const dummy = { val: 0, next: null };
    let cur = dummy;
    while (a && b) {
      if (a.val <= b.val) { cur.next = a; a = a.next; }
      else { cur.next = b; b = b.next; }
      cur = cur.next;
    }
    cur.next = a ?? b;
    return dummy.next;
  };

  let queue = lists.filter(Boolean);
  if (!queue.length) return null;

  while (queue.length > 1) {
    const next = [];
    for (let i = 0; i < queue.length; i += 2) {
      next.push(i + 1 < queue.length ? mergeTwo(queue[i], queue[i + 1]) : queue[i]);
    }
    queue = next;
  }

  return queue[0];
}`,
    python: `import heapq


def merge_k_lists(lists):
    heap = []
    for i, node in enumerate(lists):
        if node:
            # Index breaks ties so heapq never compares two nodes directly.
            heapq.heappush(heap, (node.val, i, node))

    dummy = tail = ListNode(0)
    while heap:
        _, i, node = heapq.heappop(heap)
        tail.next = node
        tail = node
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))

    return dummy.next`,
  },

  "n-queens": {
    javascript: `function solveNQueens(n) {
  const results = [];
  const queens = []; // queens[row] = column
  const cols = new Set();
  const diag = new Set();      // row - col
  const antiDiag = new Set();  // row + col

  const place = (row) => {
    if (row === n) {
      results.push(
        queens.map((c) => ".".repeat(c) + "Q" + ".".repeat(n - c - 1))
      );
      return;
    }

    for (let col = 0; col < n; col++) {
      if (cols.has(col) || diag.has(row - col) || antiDiag.has(row + col)) continue;

      queens.push(col);
      cols.add(col); diag.add(row - col); antiDiag.add(row + col);

      place(row + 1);

      queens.pop();
      cols.delete(col); diag.delete(row - col); antiDiag.delete(row + col);
    }
  };

  place(0);
  return results;
}`,
    python: `def solve_n_queens(n):
    results = []
    queens = []
    cols, diag, anti = set(), set(), set()

    def place(row):
        if row == n:
            results.append(["." * c + "Q" + "." * (n - c - 1) for c in queens])
            return

        for col in range(n):
            if col in cols or (row - col) in diag or (row + col) in anti:
                continue

            queens.append(col)
            cols.add(col); diag.add(row - col); anti.add(row + col)

            place(row + 1)

            queens.pop()
            cols.remove(col); diag.remove(row - col); anti.remove(row + col)

    place(0)
    return results`,
  },

  "word-ladder": {
    javascript: `function ladderLength(beginWord, endWord, wordList) {
  const words = new Set(wordList);
  if (!words.has(endWord)) return 0;

  let queue = [beginWord];
  let steps = 1;
  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  // Plain BFS over the implicit graph of one-letter edits.
  while (queue.length) {
    const next = [];

    for (const word of queue) {
      if (word === endWord) return steps;

      for (let i = 0; i < word.length; i++) {
        for (const ch of alphabet) {
          const candidate = word.slice(0, i) + ch + word.slice(i + 1);
          if (words.has(candidate)) {
            words.delete(candidate); // visited
            next.push(candidate);
          }
        }
      }
    }

    queue = next;
    steps++;
  }

  return 0;
}`,
    python: `from collections import deque


def ladder_length(begin_word, end_word, word_list):
    words = set(word_list)
    if end_word not in words:
        return 0

    queue = deque([(begin_word, 1)])
    alphabet = "abcdefghijklmnopqrstuvwxyz"

    while queue:
        word, steps = queue.popleft()
        if word == end_word:
            return steps

        for i in range(len(word)):
            for ch in alphabet:
                candidate = word[:i] + ch + word[i + 1:]
                if candidate in words:
                    words.remove(candidate)
                    queue.append((candidate, steps + 1))

    return 0`,
  },

  "longest-valid-parentheses": {
    javascript: `function longestValidParentheses(s) {
  let longest = 0;
  // Stack holds indices; the bottom is the last position that broke a run.
  const stack = [-1];

  for (let i = 0; i < s.length; i++) {
    if (s[i] === "(") {
      stack.push(i);
    } else {
      stack.pop();
      if (stack.length === 0) {
        stack.push(i); // new baseline
      } else {
        longest = Math.max(longest, i - stack[stack.length - 1]);
      }
    }
  }

  return longest;
}`,
    python: `def longest_valid_parentheses(s):
    longest = 0
    stack = [-1]

    for i, ch in enumerate(s):
        if ch == "(":
            stack.append(i)
        else:
            stack.pop()
            if not stack:
                stack.append(i)
            else:
                longest = max(longest, i - stack[-1])

    return longest`,
  },

  "edit-distance": {
    javascript: `function minDistance(word1, word2) {
  const m = word1.length;
  const n = word2.length;

  // Only the previous row is ever needed, so keep two rows instead of a grid.
  let prev = Array.from({ length: n + 1 }, (_, j) => j);

  for (let i = 1; i <= m; i++) {
    const curr = [i];
    for (let j = 1; j <= n; j++) {
      curr[j] =
        word1[i - 1] === word2[j - 1]
          ? prev[j - 1]
          : 1 + Math.min(prev[j - 1], prev[j], curr[j - 1]);
    }
    prev = curr;
  }

  return prev[n];
}`,
    python: `def min_distance(word1, word2):
    m, n = len(word1), len(word2)
    prev = list(range(n + 1))

    for i in range(1, m + 1):
        curr = [i] + [0] * n
        for j in range(1, n + 1):
            if word1[i - 1] == word2[j - 1]:
                curr[j] = prev[j - 1]
            else:
                curr[j] = 1 + min(prev[j - 1], prev[j], curr[j - 1])
        prev = curr

    return prev[n]`,
  },

  "sliding-window-maximum": {
    javascript: `function maxSlidingWindow(nums, k) {
  const result = [];
  const deque = []; // indices, values decreasing front -> back

  for (let i = 0; i < nums.length; i++) {
    // Drop indices that have fallen out of the window.
    if (deque.length && deque[0] <= i - k) deque.shift();

    // Anything smaller than the incoming value can never be a maximum again.
    while (deque.length && nums[deque[deque.length - 1]] <= nums[i]) deque.pop();

    deque.push(i);
    if (i >= k - 1) result.push(nums[deque[0]]);
  }

  return result;
}`,
    python: `from collections import deque


def max_sliding_window(nums, k):
    result = []
    window = deque()  # indices, values decreasing

    for i, value in enumerate(nums):
        if window and window[0] <= i - k:
            window.popleft()

        while window and nums[window[-1]] <= value:
            window.pop()

        window.append(i)
        if i >= k - 1:
            result.append(nums[window[0]])

    return result`,
  },

  "regular-expression-matching": {
    javascript: `function isMatch(s, p) {
  const m = s.length;
  const n = p.length;
  // dp[i][j] = does s[0..i) match p[0..j)
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(false));
  dp[0][0] = true;

  // An empty string can still match patterns like a*b*c*.
  for (let j = 1; j <= n; j++) {
    if (p[j - 1] === "*") dp[0][j] = dp[0][j - 2];
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (p[j - 1] === "*") {
        const zero = dp[i][j - 2];
        const more =
          (p[j - 2] === "." || p[j - 2] === s[i - 1]) && dp[i - 1][j];
        dp[i][j] = zero || more;
      } else if (p[j - 1] === "." || p[j - 1] === s[i - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      }
    }
  }

  return dp[m][n];
}`,
    python: `def is_match(s, p):
    m, n = len(s), len(p)
    dp = [[False] * (n + 1) for _ in range(m + 1)]
    dp[0][0] = True

    for j in range(1, n + 1):
        if p[j - 1] == "*":
            dp[0][j] = dp[0][j - 2]

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if p[j - 1] == "*":
                zero = dp[i][j - 2]
                more = p[j - 2] in (".", s[i - 1]) and dp[i - 1][j]
                dp[i][j] = zero or more
            elif p[j - 1] in (".", s[i - 1]):
                dp[i][j] = dp[i - 1][j - 1]

    return dp[m][n]`,
  },
};
