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
};
