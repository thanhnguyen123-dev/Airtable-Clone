type ColumnTypeIconProps = {
  columnType: string;
}

const ColumnTypeIcon = ({ columnType }: ColumnTypeIconProps) => {
  if (columnType === "TEXT") {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        className="flex-none"
        fill="rgb(71, 85, 105)"
      >
        <use href="icons/icons_definitions.svg#TextAlt"></use>
      </svg>
    );
  } else {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        className="flex-none"
        fill="rgb(71, 85, 105)"
      >
        <use href="icons/icons_definitions.svg#HashStraight"></use>
      </svg>
    );
  }
};

export default ColumnTypeIcon;