const levels = {
    low: {
        label: "Risco baixo",
        classes: "bg-green-100 text-green-700 border-green-200",
    },
    medium: {
        label: "Risco moderado",
        classes: "bg-orange-100 text-orange-700 border-orange-200",
    },
    high: {
        label: "Risco elevado",
        classes: "bg-red-100 text-red-700 border-red-200",
    },
};

const RiskBadge = ({ level }) => {
    const config = levels[level] ?? levels.low;
    return (
        <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${config.classes}`}
        >
      {config.label}
    </span>
    );
};

export default RiskBadge;
