import { format } from "date-fns";
import { ru } from "date-fns/locale";
import CommentLike from "./CommentLike";

export default function Comments({ comments }) {
    return (
        <div>
            <hr className="my- border-t-2 border-lime-200" />
            <h2 className="text-xl font-semibold mb-3 text-lime-900 mt-10 ml-3">Комментарии {comments.length}</h2> 
            {comments.length === 0 ? (
                <div className="ml-3">Нет комментариев для этого рецепта</div>
            ): (
                comments.map(comment => (
                    <div key={comment.id} className="mb-3 text-bg text-gray-800 flex bg-white rounded-xl shadow-md overflow-hidden mx-auto  justify-between">
                         {/* Левая часть */}
                        <div className="ml-5 flex flex-col">
                            <div className="mb-4 mt-2 font-bold text-xs">{comment.author.username}</div>
                            <div className="mb-4 mt-2 font-medium text-sm">{comment.comment}</div>
                        </div>
                         {/* Правая часть — прижата к правому краю */}
                        <div className="flex flex-col items-end text-right mr-5">
                            <div className="mb-4 mt-2 font-medium text-sm">{format(new Date(comment.created), "d MMMM yyyy, HH:mm", { locale: ru})}</div>
                            <div className="flex items-center">
                            <CommentLike commentId={comment.id} initialLiked={false} initialCouunt={comment.likes_count} />
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}