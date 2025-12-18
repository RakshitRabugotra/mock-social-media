"use client";

import { useState } from "react";
/**
 * There are certain sections in te post box.
 * - Header:
 *   - Can be a title, or
 *   - Can be a:
 *     - left: avatar + username + timestamp + edited/not-edited
 *     - right: actions (like edit, delete if the user is the owner of the post)
 *
 * - Post content
 *   - Left side contains an emoji (as minimum width as possible)
 *   - Right container taking the majority of width contains the post content
 *
 * - Actions
 *   - Comments: (Opens a comment modal containing all the comments)
 */

import Avatar from "../avatar";
import { CommentIcon } from "../icons";
import { twMerge } from "tailwind-merge";

export interface Post {
  _id: string;
  avatar: string;
  username: string;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
  feelingEmoji: string;
  postContent: string;
}

const BasePostBox = ({
  header,
  actions,
  actionAlignment = "left",
  feelingEmoji = "💭",
  editable = false,
  content,
  onContentChange,
}: {
  header?: React.ReactNode;
  actions?: React.ReactNode;
  feelingEmoji?: string;
  editable?: boolean;
  actionAlignment?: "left" | "right";
  content?: string;
  onContentChange?: (content: string) => void;
}) => {
  return (
    <section className="font-inter post-box__container bg-card-background p-4 border-2 border-border rounded-lg shadow-sm shadow-border focus-within:border-muted">
      {/* Header */}
      <div className="post-box__header flex flex-row justify-between items-center">
        {/* Left side contains avatar + username + timestamp + edited/not-edited */}
        {header}
      </div>

      {/* The main content */}
      <div className="post-box__content flex flex-row justify-between items-start bg-card-content-background rounded-lg p-4 mt-4 gap-4">
        {/* Contains an emoji on the left side */}
        <div className="post-box__content-emoji">
          <p className="post-box__content-emoji-text rounded-full text-sm p-2 bg-emoji-background size-10 flex items-center justify-center">
            {feelingEmoji}
          </p>
        </div>
        {/* Right container taking the majority of width contains the post content */}
        <textarea
          className="post-box__content-right-text text-shadow-white font-normal text-sm text-muted leading-tight w-full cursor-text focus:outline-none"
          value={content}
          disabled={!editable}
          onChange={(e) => onContentChange?.(e.target.value)}
          placeholder={editable ? "How are you feeling today?" : "No content"}
          name="content"
          id={"post-box-content-textarea-" + Math.random().toString(36)}
        />
      </div>

      {/* Actions */}
      <div
        className={twMerge(
          "post-box__actions mt-4 flex flex-row",
          actionAlignment === "left" ? "justify-start" : "justify-end"
        )}
      >
        {actions}
      </div>
    </section>
  );
};

export const PostBoxView = ({
  _id,
  editable = false,
  avatar,
  username,
  timestamp,
  createdAt,
  updatedAt,
  feelingEmoji,
  postContent,
}: Post & { editable?: boolean }) => {
  // Let's use the state variable to edit it later on
  const [content, setContent] = useState(postContent);

  // If the two dates are not the same, then the post is edited
  const edited = updatedAt !== createdAt;

  return (
    <BasePostBox
      header={
        <>
          {/* Left side contains avatar + username + timestamp + edited/not-edited */}
          <div className="post-box__header-left flex flex-row gap-4 items-center justify-between">
            <Avatar
              src={avatar}
              name={username}
              className="aspect-square size-12"
            />

            <div className="flex flex-col">
              <p className="post-box__header-left-content-username text-sm text-heading font-medium">
                {username}
              </p>

              <span className="text-xs text-muted font-medium">
                <p className="post-box__header-left-content-timestamp inline-block">
                  {timestamp}
                </p>
                {edited && (
                  <p className="post-box__header-left-content-edited inline-block">
                    &nbsp;&bull;&nbsp;Edited
                  </p>
                )}
              </span>
            </div>
          </div>
          {/* Right side contains actions (like edit, delete if the user is the owner of the post) */}
          <div className="post-box__header-right group">
            <button className="post-box__header-right-action group-hover:bg-white rounded-sm aspect-square size-5 group-hover:text-black transition-colors duration-200">
              &middot;&middot;&middot;
            </button>
          </div>
        </>
      }
      actions={
        <button className="post-box__actions flex flex-row gap-2 group">
          <CommentIcon
            width={19}
            height={16}
            className="group-hover:underline group-hover:stroke-white transition-colors duration-200"
          />
          {/* Showing the comment count */}
          <span className="font-medium text-xs text-muted group-hover:underline group-hover:text-white transition-colors duration-200">
            24 Comments
          </span>
        </button>
      }
      content={content}
      feelingEmoji={feelingEmoji}
      onContentChange={setContent}
      editable={editable}
    />
  );
};

export const PostBoxCreate = ({}: {}) => {
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    console.log("SUBMITTTED - ", content);
  }

  return (
    <BasePostBox
      header={
        <>
          {/* Left side contains avatar + username + timestamp + edited/not-edited */}
          <div className="post-box__header-left flex flex-row gap-4 items-center justify-between">
            <p className="post-box__header-left-content-username text-sm text-heading font-medium">
              Create Post
            </p>
          </div>
        </>
      }
      actionAlignment="right"
      actions={
        <button className="post-box__actions flex flex-row gap-2 min-w-28 items-center justify-center bg-button-background rounded-lg p-2" onClick={handleSubmit}>
          {/* <SendIcon
            width={19}
            height={16}
          /> */}
          {/* Showing the comment count */}
          <span className="font-medium text-xs text-white">
           Post
          </span>
        </button>
      }
      content={content}
      onContentChange={setContent}
      editable
    />
  );
};
