export default function Pagination({ page, setPage, totalPages }) { 
    return (
        <div className="w-full flex justify-center gap-2">
            <button disabled={page === 1} onClick={() => setPage(page - 1)}
            className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white">
                Назад
            </button>
            {[...Array(totalPages)].map((_, idx) => (
                <button key={idx} onClick={() => setPage(idx + 1)}
                className={`px-3 py-1 rounded ${page === idx + 1 ? "bg-emerald-700 text-white" : "bg-emerald-500 hover:bg-emerald-600"}`}>
                    {idx + 1}
                </button>
            ))}
            <button disabled={page === totalPages} onClick={() => setPage(page + 1)}
            className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white">
                Далее
            </button>
        </div>
    );
}