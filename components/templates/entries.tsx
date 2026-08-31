import type { CatalogEntry } from "@/components/sections/catalog-types";
import { AirbnbListingPage } from "@/components/templates/airbnb-listing-page";
import { BlogIndexPage } from "@/components/templates/blog-index-page";
import { BlogPostPage } from "@/components/templates/blog-post-page";
import { CataloguePage } from "@/components/templates/catalogue-page";
import { GalleryPage } from "@/components/templates/gallery-page";
import { TourDetailPage } from "@/components/templates/tour-detail-page";
import { demoGallery, demoTours } from "@/content/demo";

export const TEMPLATE_ENTRIES: CatalogEntry[] = [
  { code: "PAGE-TOUR-DETAIL", category: "Page templates", label: "A single listing page: full width photo mosaic, a title line with rating and location, a two column body (summary stats, description, what's included, a numbered itinerary, a host card) beside a sticky booking rail, then reviews, an embedded map and a cancellation policy list below the fold. Best for the detail page of one bookable product, a specific tour, charter or rental night, where the price and book button need to stay in view while the visitor reads.", fullPage: true,
    file: "components/templates/tour-detail-page.tsx", component: "TourDetailPage", props: "tour: Tour, images: Img[], included: IncludedItem[], itinerary: ItineraryStop[], reviews: Testimonial[], policy: {title,body}[], hostName/hostRole/hostBio/hostImage, location, mapQuery, brand",
    node: <TourDetailPage tour={demoTours[0]} images={demoGallery.slice(0, 14)} /> },

  { code: "PAGE-CATALOGUE", category: "Page templates", label: "A filterable results page: sticky chip filter bar with a sort select and live result count sits above a responsive card grid that pages in with a load more button, plus a real empty state that resets the filters. Best for browsing many similar bookable items, tours, services or rooms, when visitors narrow by facets like duration, time of day, price band or group type.", fullPage: true,
    file: "components/templates/catalogue-page.tsx", component: "CataloguePage", props: "tours: Tour[], facets: Facet[], eyebrow, heading, intro, brand",
    node: <CataloguePage heading="Six ways off the dock at Slip 14" eyebrow="Every trip we run" /> },

  { code: "PAGE-LISTING-GRID", category: "Page templates", label: "An Airbnb style browse index: a sticky scrolling row of category icons sits above a dense four up grid of photo led cards with save hearts and inline ratings, and a map button splits the page into list plus embedded map. Best for a marketplace style index of many listings, stays, rentals or spaces, where the photo does the selling and guests browse by category or location rather than by detailed filters.", fullPage: true,
    file: "components/templates/airbnb-listing-page.tsx", component: "AirbnbListingPage", props: "listings: Listing[], rail: RailItem[], heading, mapQuery, brand",
    node: <AirbnbListingPage heading="Boat trips out of Renaissance Marina" /> },

  { code: "PAGE-GALLERY", category: "Page templates", label: "A dedicated photo page: a wide editorial heading, category tabs that really filter the set, a masonry grid with a lightbox, and a closing colour band CTA. Best for a standalone 'in pictures' page, behind the scenes, a portfolio or a photo led about page, where the point is browsing many images by theme rather than any single bookable item.", fullPage: true,
    file: "components/templates/gallery-page.tsx", component: "GalleryPage", props: "images: Img[], categories: GalleryCategory[], eyebrow, heading, intro, ctaTitle, ctaBody, ctaLabel, ctaHref, brand",
    node: <GalleryPage heading="Twelve seasons of water, shot from the deck" /> },

  { code: "PAGE-BLOG-INDEX", category: "Page templates", label: "A magazine style index: a serif masthead, a category rail, one large lead story, a hairline grid of further posts with a featured double width first entry, numbered pagination and a newsletter signup strip. Best for the blog or journal landing page that lists many posts and needs to spotlight the newest or most important one while collecting email signups.", fullPage: true,
    file: "components/templates/blog-index-page.tsx", component: "BlogIndexPage", props: "posts: Post[], heading: SectionHeading, brand",
    node: <BlogIndexPage /> },

  { code: "PAGE-BLOG-POST", category: "Page templates", label: "A long form reading page: a progress hairline, a measured single column of body blocks (headings, paragraphs, quotes, images), a sticky table of contents and share rail on wide screens, an author card, and three related posts at the end. Best for the article itself once a reader has clicked in from the blog index, where legibility and staying oriented in a long piece matter more than navigation chrome.", fullPage: true,
    file: "components/templates/blog-post-page.tsx", component: "BlogPostPage", props: "post: Post, body: PostBlock[], related: Post[], brand",
    node: <BlogPostPage /> },
];
