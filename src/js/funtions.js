export function hasLeadingOrTrailingSpace(name) {
    return /^\s/.test(name) || /\s$/.test(name);
  }