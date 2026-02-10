'use client';

export default function PrintButton() {
    return (
        <button
            onClick={() => window.print()}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-lg font-medium"
        >
            Print / Download PDF
        </button>
    );
}
