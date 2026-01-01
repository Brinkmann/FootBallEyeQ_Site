"use client";

import { useState, useMemo } from "react";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";
import faqData from "../../faq-data.json";

interface FAQQuestion {
  id: string;
  category: string;
  priority: number;
  question: string;
  answer: string;
  tags: string[];
  searchKeywords: string[];
}

interface FAQCategory {
  id: string;
  name: string;
  priority: number;
  icon: string;
  description: string;
}

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  const categories = faqData.categories as FAQCategory[];
  const questions = faqData.questions as FAQQuestion[];

  const filteredQuestions = useMemo(() => {
    let filtered = questions;

    if (selectedCategory) {
      filtered = filtered.filter((q) => q.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const searchTerms = searchQuery.toLowerCase().split(/\s+/).filter((term) => term.length > 0);
      filtered = filtered.filter((q) => {
        const searchableText = [
          q.question,
          q.answer,
          ...q.tags,
          ...q.searchKeywords,
        ]
          .join(" ")
          .toLowerCase();
        return searchTerms.every((term) => searchableText.includes(term));
      });
    }

    return filtered.sort((a, b) => a.priority - b.priority);
  }, [questions, selectedCategory, searchQuery]);

  const toggleQuestion = (questionId: string) => {
    setExpandedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  };

  const getCategoryById = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId);
  };

  const questionsByCategory = useMemo(() => {
    if (selectedCategory || searchQuery.trim()) {
      return null;
    }
    const grouped: Record<string, FAQQuestion[]> = {};
    questions.forEach((q) => {
      if (!grouped[q.category]) {
        grouped[q.category] = [];
      }
      grouped[q.category].push(q);
    });
    Object.keys(grouped).forEach((cat) => {
      grouped[cat].sort((a, b) => a.priority - b.priority);
    });
    return grouped;
  }, [questions, selectedCategory, searchQuery]);

  const renderAnswer = (answer: string) => {
    const parts = answer.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="font-semibold text-gray-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f0e8]">
      <NavBar />
      
      <main className="flex-1 px-4 py-8 max-w-4xl mx-auto w-full">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600">
            Find answers to common questions about Football EyeQ
          </p>
        </div>

        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-2 pb-2 min-w-max">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                selectedCategory === null
                  ? "bg-[#e63946] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              All Topics
            </button>
            {categories
              .sort((a, b) => a.priority - b.priority)
              .map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition flex items-center gap-2 ${
                    selectedCategory === category.id
                      ? "bg-[#e63946] text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
          </div>
        </div>

        {searchQuery.trim() && (
          <p className="text-sm text-gray-500 mb-4">
            {filteredQuestions.length} result{filteredQuestions.length !== 1 ? "s" : ""} found
          </p>
        )}

        {(selectedCategory || searchQuery.trim()) ? (
          <div className="space-y-3">
            {filteredQuestions.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl">
                <p className="text-gray-500">No questions found matching your search.</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory(null);
                  }}
                  className="mt-4 text-[#e63946] hover:underline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              filteredQuestions.map((question) => (
                <div
                  key={question.id}
                  className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm"
                >
                  <button
                    onClick={() => toggleQuestion(question.id)}
                    className="w-full px-5 py-4 text-left flex items-start justify-between gap-4"
                  >
                    <div className="flex-1">
                      <span className="text-gray-900 font-medium">{question.question}</span>
                      {!selectedCategory && (
                        <span className="ml-2 text-xs text-gray-400">
                          {getCategoryById(question.category)?.icon}
                        </span>
                      )}
                    </div>
                    <svg
                      className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                        expandedQuestions.has(question.id) ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedQuestions.has(question.id) && (
                    <div className="px-5 pb-5">
                      <div className="pt-3 border-t border-gray-100">
                        <p className="text-gray-600 leading-relaxed">
                          {renderAnswer(question.answer)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {categories
              .sort((a, b) => a.priority - b.priority)
              .map((category) => {
                const categoryQuestions = questionsByCategory?.[category.id] || [];
                if (categoryQuestions.length === 0) return null;
                
                return (
                  <div key={category.id}>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl">{category.icon}</span>
                      <h2 className="text-xl font-semibold text-gray-900">{category.name}</h2>
                      <span className="text-sm text-gray-400">({categoryQuestions.length})</span>
                    </div>
                    <div className="space-y-3">
                      {categoryQuestions.slice(0, 5).map((question) => (
                        <div
                          key={question.id}
                          className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm"
                        >
                          <button
                            onClick={() => toggleQuestion(question.id)}
                            className="w-full px-5 py-4 text-left flex items-start justify-between gap-4"
                          >
                            <span className="text-gray-900 font-medium flex-1">
                              {question.question}
                            </span>
                            <svg
                              className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                                expandedQuestions.has(question.id) ? "rotate-180" : ""
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          {expandedQuestions.has(question.id) && (
                            <div className="px-5 pb-5">
                              <div className="pt-3 border-t border-gray-100">
                                <p className="text-gray-600 leading-relaxed">
                                  {renderAnswer(question.answer)}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      {categoryQuestions.length > 5 && (
                        <button
                          onClick={() => setSelectedCategory(category.id)}
                          className="text-[#e63946] hover:underline text-sm font-medium pl-2"
                        >
                          See all {categoryQuestions.length} questions in {category.name} →
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
