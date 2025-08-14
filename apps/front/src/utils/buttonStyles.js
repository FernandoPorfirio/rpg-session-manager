import { COLORS, BORDER_RADIUS } from "./constants";

const createButtonBaseStyles = () => ({
  width: 40,
  height: 40,
  borderRadius: BORDER_RADIUS.medium,
  border: "1px solid transparent",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
    opacity: 0,
    transition: "opacity 0.3s ease",
  },
  "&:hover::before": {
    opacity: 1,
  },
  "&:active": {
    transform: "translateY(0) scale(1.02)",
  },
});

export const createButtonStyles = (color, hoverColor) => ({
  ...createButtonBaseStyles(),
  background: `linear-gradient(135deg, ${color}1A 0%, ${color}0D 100%)`,
  color,
  border: `1px solid ${color}33`,
  "&:hover": {
    background: `linear-gradient(135deg, ${color}33 0%, ${color}1A 100%)`,
    borderColor: color,
    transform: "translateY(-2px) scale(1.05)",
    boxShadow: `0 6px 20px ${color}4D, 0 0 0 3px ${color}1A`,
    color: hoverColor || color,
  },
});

export const actionButtonStyles = {
  view: createButtonStyles(COLORS.view, COLORS.text),
  edit: createButtonStyles(COLORS.edit, COLORS.primaryDark),
  delete: createButtonStyles(COLORS.delete, "#DC143C"),
  managePlayers: createButtonStyles(COLORS.success, "#2E4A1F"),
  generateGuilds: createButtonStyles(COLORS.warning, "#FF6347"),
  viewGuilds: createButtonStyles("#800080", "#9932CC"),
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
