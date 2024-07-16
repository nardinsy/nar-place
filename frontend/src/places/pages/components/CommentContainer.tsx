import { FC, useEffect, useState } from "react";
import classes from "../PlacePage.module.css";
import CommetnsList from "./comment/CommentsList";
import { CommentDto } from "../../../helpers/dtos";
import useRequiredBackend from "../../../hooks/use-required-backend";

type CommentContainerT = {
  placeId: string;
};

const CommentContainer = ({ placeId }: { placeId: string }) => {
  const [comments, setCommetns] = useState<CommentDto[]>([]);
  const backend = useRequiredBackend();

  useEffect(() => {
    const getCommetns = async () => {
      const comments = await backend.getComments(placeId);

      setCommetns(comments);
    };

    getCommetns();
    return () => {};
  }, []);

  return (
    <div className={classes["comment-view-model"]}>
      <h3>Comments</h3>
      <CommetnsList comments={comments} />
    </div>
  );
};

export default CommentContainer;
