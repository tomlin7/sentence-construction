import { Separator } from "@/components/ui/separator";
import { EditIcon, MoreHorizontal } from "lucide-react";

interface StartScreenProps {
  onStart: () => void;
  coins: number;
  totalQuestions: number;
}

export default function StartScreen({
  onStart,
  coins,
  totalQuestions,
}: StartScreenProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <nav className="flex justify-end p-4 shadow-lg/4">
        <h1 className="absolute left-1/2 text-xl transform -translate-x-1/2 font-medium text-gray-700 hidden md:block">
          Sentence Construction
        </h1>
        <h1 className="md:hidden text-xl font-medium text-gray-700 mr-auto">
          Sentence Construction
        </h1>
        <button className="p-2 rounded-full hover:bg-gray-50">
          <MoreHorizontal className="w-6 h-6 text-gray-700" />
        </button>
      </nav>

      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <main className="max-w-2xl w-full px-4 flex flex-col items-center justify-center pointer-events-auto">
          <div className="flex justify-center mb-6">
            <EditIcon className="w-10 h-10 text-gray-400" />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-center text-[#0f1010] mb-4">
            Sentence Construction
          </h2>

          <p className="text-center text-[#7c8181] mb-8 md:mb-12 max-w-md px-4">
            Select the correct words to complete the sentence by arranging the
            provided options in the right order.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-between w-full p-3 mb-8 md:mb-12 gap-4 md:gap-0 md:h-20">
            <div className="flex flex-col items-center w-full md:w-1/3">
              <p className="text-gray-800 font-medium mb-2 whitespace-nowrap">
                Time Per Question
              </p>
              <p className="text-gray-500">30 sec</p>
            </div>
            <Separator orientation="horizontal" className="w-1/2 md:hidden" />
            <Separator orientation="vertical" className="hidden md:block" />
            <div className="flex flex-col items-center w-full md:w-1/3">
              <p className="text-gray-800 font-medium mb-2 whitespace-nowrap">
                Total Questions
              </p>
              <p className="text-gray-500">{totalQuestions}</p>
            </div>
            <Separator orientation="horizontal" className="w-1/2 md:hidden" />
            <Separator orientation="vertical" className="hidden md:block" />
            <div className="flex flex-col items-center w-full md:w-1/3">
              <p className="text-gray-800 font-medium mb-2">Coins</p>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded-full bg-amber-300"></div>
                <p className="text-gray-500">{coins || 0}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 w-full max-w-md px-4">
            <button className="flex-1 w-full py-3 pbutton">Back</button>
            <button
              className="flex-1 w-full py-3 pbutton-filled"
              onClick={onStart}
            >
              Start
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
