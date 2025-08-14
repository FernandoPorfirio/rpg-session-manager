import { COLORS, BORDER_RADIUS } from "./constants";

export const inputStyles = {
  "& .MuiInputBase-input": {
    py: 2,
    fontSize: "1.1rem",
  },
  "& .MuiInputLabel-root": {
    fontSize: "1.1rem",
  },
};

export const selectStyles = {
  "& .MuiSelect-select": {
    py: 2,
    fontSize: "1.1rem",
  },
};

export const textAreaStyles = {
  "& .MuiInputBase-input": {
    fontSize: "1.1rem",
    lineHeight: 1.6,
  },
  "& .MuiInputLabel-root": {
    fontSize: "1.1rem",
  },
  "& .MuiOutlinedInput-root": {
    "& textarea": {
      minHeight: "120px !important",
    },
  },
};

export const buttonStyles = {
  px: 3,
  py: 1.5,
  fontSize: "1.1rem",
  minWidth: 120,
};

export const tableHeaderStyles = {
  fontWeight: "bold",
  fontSize: "1.1rem",
};

export const tableCellStyles = {
  py: 2,
  fontSize: "1.1rem",
};

export const tableRowHoverStyles = {
  "&:hover": {
    backgroundColor: `${COLORS.secondary}0D`, // 5% opacity
  },
};

export const tableContainerStyles = {
  border: `2px solid ${COLORS.primary}4D`,
  borderRadius: BORDER_RADIUS.large,
  overflow: "hidden",
};

export const dialogStyles = {
  title: { px: 4, py: 3 },
  content: { px: 4, pb: 2 },
  actions: { px: 4, py: 3, gap: 2, justifyContent: "flex-end" },
};

export const modalButtonStyles = {
  cancel: {
    minWidth: 140,
    py: 1.5,
    fontSize: "1.1rem",
    borderColor: `${COLORS.primary}80`,
    color: COLORS.primary,
    "&:hover": {
      borderColor: COLORS.primary,
      backgroundColor: `${COLORS.primary}0D`,
    },
  },
  submit: {
    minWidth: 160,
    py: 1.5,
    fontSize: "1.1rem",
    backgroundColor: COLORS.primary,
    "&:hover": {
      backgroundColor: COLORS.primaryLight,
    },
  },
};
