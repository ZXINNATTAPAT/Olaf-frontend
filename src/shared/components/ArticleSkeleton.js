import React from 'react';

// Reusable simple skeleton pulse class
const skeletonClass = "bg-gray-200 animate-pulse rounded";

/**
 * ArticleSkeleton - Specifically designed for the Article View Page
 * Mimics the layout of: Breadcrumb -> Header -> Image -> Content -> Actions
 */
const ArticleSkeleton = () => {
    return (
        <div className="container mx-auto px-4 max-w-4xl py-6 md:py-12 animate-fadeIn">
            {/* 1. Breadcrumb Skeleton */}
            <div className="flex items-center gap-3 mb-8 md:mb-12">
                <div className={`h-4 w-12 ${skeletonClass}`}></div>
                <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
                <div className={`h-4 w-16 ${skeletonClass}`}></div>
                <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
                <div className={`h-4 w-32 ${skeletonClass}`}></div>
            </div>

            {/* 2. Header Skeleton (Title & Meta) */}
            <div className="space-y-4 mb-8">
                {/* Title */}
                <div className={`h-10 w-3/4 ${skeletonClass}`}></div>
                <div className={`h-10 w-1/2 ${skeletonClass}`}></div>

                {/* Meta (Start Date, End Date, User) */}
                <div className="flex items-center gap-4 pt-2">
                    <div className={`h-10 w-10 rounded-full ${skeletonClass}`}></div>
                    <div className="space-y-2">
                        <div className={`h-3 w-24 ${skeletonClass}`}></div>
                        <div className={`h-3 w-16 ${skeletonClass}`}></div>
                    </div>
                </div>
            </div>

            {/* 3. Main Image Skeleton */}
            <div className={`w-full aspect-[16/9] md:aspect-[21/9] mb-10 ${skeletonClass}`}></div>

            {/* 4. Content Paragraphs Skeleton */}
            <div className="space-y-4 max-w-[700px] mx-auto mb-12">
                <div className={`h-4 w-full ${skeletonClass}`}></div>
                <div className={`h-4 w-full ${skeletonClass}`}></div>
                <div className={`h-4 w-5/6 ${skeletonClass}`}></div>
                <div className={`h-4 w-full ${skeletonClass}`}></div>
                <div className={`h-4 w-4/5 ${skeletonClass}`}></div>
                <div className="h-8"></div> {/* Spacer */}
                <div className={`h-4 w-full ${skeletonClass}`}></div>
                <div className={`h-4 w-11/12 ${skeletonClass}`}></div>
                <div className={`h-4 w-full ${skeletonClass}`}></div>
            </div>

            {/* 5. Actions Skeleton (Like, Comment, Share) */}
            <div className="border-t border-b border-gray-100 py-6 my-12 max-w-[700px] mx-auto flex gap-6">
                <div className={`h-8 w-8 rounded-full ${skeletonClass}`}></div>
                <div className={`h-8 w-8 rounded-full ${skeletonClass}`}></div>
                <div className={`h-8 w-8 rounded-full ${skeletonClass}`}></div>
            </div>
        </div>
    );
};

export default ArticleSkeleton;
