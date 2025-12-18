"use client";

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

import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { useSession } from "next-auth/react";
import AuthModal from "@/components/authentication/auth-modal";
import Avatar from "../avatar";
import { CommentIcon } from "../icons";
import { twMerge } from "tailwind-merge";
import { createPostSchema } from "@/validation/post-schema";
import { Post } from "@/models/Post";
import { getReferenceField } from "@/lib/utils";
import { getEmojiFromText } from "@/lib/emoji-from-text";
import { Reference } from "@/types";
import { User } from "@/models/User";

const BasePostBox = ({
  id,
  header,
  actions,
  actionAlignment = "left",
  feelingEmoji = "💭",
  editable = false,
  content,
  onContentChange,
}: {
  id: string;
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
          id={"post-box-content-textarea-" + id}
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

// Helper function to get owner ID from Reference
const getOwnerId = (owner: Reference<User>): string => {
  if (typeof owner === "string") {
    return owner;
  }
  return owner._id;
};

export const PostBoxView = ({
  _id,
  editable = false,
  content: postContent,
  owner,
  createdAt,
  updatedAt,
  feelingEmoji: initialFeelingEmoji,
}: Post & { editable?: boolean }) => {
  const { data: session } = useSession();
  const [content, setContent] = useState(postContent);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [feelingEmoji, setFeelingEmoji] = useState(initialFeelingEmoji);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // If the two dates are not the same, then the post is edited
  const edited = updatedAt !== createdAt;

  // Get the other fields from the post data
  const avatar = getReferenceField(owner, (user) => user.avatarUrl, "");
  const username = getReferenceField(owner, (user) => user.username, "");
  const timestamp = "just now";

  // Check if current user is the owner
  const ownerId = getOwnerId(owner);
  const isOwner = session?.user?.id === ownerId;

  // Update emoji when content changes during editing
  useEffect(() => {
    if (isEditing) {
      const emoji = getEmojiFromText(content);
      setFeelingEmoji(emoji);
    }
  }, [content, isEditing]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showMenu]);

  const handleEdit = () => {
    setIsEditing(true);
    setShowMenu(false);
  };

  const handleCancel = () => {
    setContent(postContent);
    setFeelingEmoji(initialFeelingEmoji);
    setIsEditing(false);
  };

  const handleSave = async () => {
    // Validate content
    const result = createPostSchema.safeParse({ content });
    if (!result.success) {
      // You could show an error message here
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`/api/v1/posts/${_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, feelingEmoji }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        // Handle error - you could show an error message here
        console.error("Failed to update post:", data.error);
        return;
      }

      // Success - exit edit mode
      setIsEditing(false);
      // Optionally, you could notify the parent component to refresh the post
    } catch (err) {
      console.error("Error updating post:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/v1/posts/${_id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        // Handle error - you could show an error message here
        console.error("Failed to delete post:", data.error);
        return;
      }

      // Success - close menu and confirmation
      setShowDeleteConfirm(false);
      setShowMenu(false);
      // Optionally, you could notify the parent component to remove the post from the list
      // For now, we'll reload the page to reflect the deletion
      window.location.reload();
    } catch (err) {
      console.error("Error deleting post:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card-background border-2 border-border rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-heading mb-4">
              Delete Post
            </h3>
            <p className="text-sm text-muted mb-6">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            <div className="flex flex-row gap-2 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-muted bg-card-content-background rounded-lg hover:bg-opacity-80 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
      <BasePostBox
        id={_id}
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
          {isOwner && (
            <div className="post-box__header-right relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="post-box__header-right-action group-hover:bg-white rounded-sm aspect-square size-5 group-hover:text-black transition-colors duration-200"
              >
                &middot;&middot;&middot;
              </button>
              {showMenu && (
                <div className="absolute right-0 top-6 bg-card-background border-2 border-border rounded-lg shadow-lg z-10 min-w-32">
                  <button
                    onClick={handleEdit}
                    className="w-full text-left px-4 py-2 text-sm text-heading hover:bg-card-content-background transition-colors duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      setShowDeleteConfirm(true);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-card-content-background transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      }
      actions={
        <>
          {isEditing ? (
            <div className="flex flex-row gap-2">
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="post-box__actions flex flex-row gap-2 min-w-20 items-center justify-center bg-card-background border-2 border-border rounded-lg p-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-card-content-background transition-colors duration-200"
              >
                <span className="font-medium text-xs text-muted">Cancel</span>
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="post-box__actions flex flex-row gap-2 min-w-20 items-center justify-center bg-button-background rounded-lg p-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="font-medium text-xs text-white">
                  {isSaving ? "Saving..." : "Save"}
                </span>
              </button>
            </div>
          ) : (
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
          )}
        </>
      }
      content={content}
      feelingEmoji={feelingEmoji}
      onContentChange={setContent}
      editable={isEditing || editable}
    />
    </>
  );
};

export const PostBoxCreate = ({
  onRequestCreate,
  onRequestSuccess,
  onRequestError,
}: {
  // We want to notify the parent component that we want to create a new post, so it can reflect it on the list
  onRequestCreate: (post: Post) => void;

  // If the post is created successfully,
  onRequestSuccess: (post: Post) => void;

  // If there was some error, notify the parent component so it can remove it from the list
  onRequestError: (id: string, error: string) => void;
}) => {
  const { data: session, status } = useSession();
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [feelingEmoji, setFeelingEmoji] = useState("💭");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleSubmit = async () => {
    // Check if user is authenticated
    if (status === "unauthenticated" || !session) {
      setIsAuthModalOpen(true);
      return;
    }

    // Clear previous errors
    setError(null);

    // Validate using Zod schema
    const result = createPostSchema.safeParse({ content });

    if (!result.success) {
      // Get the first error message
      const firstError = result.error.issues[0];
      setError(firstError.message);
      return;
    }

    // The post is good to create, so notify the parent component
    const id = uuidv4();
    onRequestCreate({
      _id: id,
      content: content,
      owner: "",
      isDelete: false,
      feelingEmoji: feelingEmoji,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Validation passed, proceed with submission
    setIsLoading(true);
    try {
      const response = await fetch("/api/v1/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, feelingEmoji }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        // Handle API error - notify parent to remove optimistic post
        const errorMessage = data.error || "Failed to create post";
        setError(errorMessage);
        onRequestError(id, errorMessage);
        return;
      }
      // Success - clear content
      setContent("");
      // use a callback prop to notify parent component
      onRequestSuccess(data.data);
    } catch (err) {
      // Handle network or other errors - notify parent to remove optimistic post
      const errorMessage = "Network error. Please try again.";
      setError(errorMessage);
      console.error("Error creating post:", err);
      onRequestError(id, errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Get the emoji from the text
  useEffect(() => {
    const emoji = getEmojiFromText(content);
    setFeelingEmoji(emoji);
  }, [content]);

  // Close modal when user becomes authenticated
  useEffect(() => {
    if (status === "authenticated" && session && isAuthModalOpen) {
      setIsAuthModalOpen(false);
    }
  }, [status, session, isAuthModalOpen]);

  return (
    <>
      <BasePostBox
        id="create-post-box"
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
          <>
            {error && (
              <span className="text-xs text-red-500 mr-2 flex-1">{error}</span>
            )}
            <button
              className="post-box__actions flex flex-row gap-2 min-w-28 items-center justify-center bg-button-background rounded-lg p-2 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {/* <SendIcon
                width={19}
                height={16}
              /> */}
              {/* Showing the comment count */}
              <span className="font-medium text-xs text-white">
                {isLoading ? "Posting..." : "Post"}
              </span>
            </button>
          </>
        }
        feelingEmoji={feelingEmoji}
        content={content}
        onContentChange={(newContent) => {
          setContent(newContent);
          // Clear error when user starts typing
          if (error) {
            setError(null);
          }
        }}
        editable
      />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialView="sign-in"
      />
    </>
  );
};
