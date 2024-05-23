import Quote from "inspirational-quotes";

export const InspirationalQuote = () => {
  const quote = Quote.getQuote();

  return (
    <>
      {" "}
      {quote && (
        <div className="w-full bg-slate-800/70 border border-gray-600/70 rounded-xl p-4 mt-8">
          <p className="tracking-wide">&quot;{quote?.text}&quot;</p>
          <p className="text-right mt-2 text-sm">- {quote?.author}</p>
        </div>
      )}
    </>
  );
};
