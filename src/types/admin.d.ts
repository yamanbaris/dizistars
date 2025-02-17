declare module '@/components/admin/tabs/StarsTab' {
  const StarsTab: React.FC;
  export default StarsTab;
}

declare module '@/components/admin/tabs/NewsTab' {
  const NewsTab: React.FC;
  export default NewsTab;
}

declare module '@/components/admin/tabs/CommentsTab' {
  const CommentsTab: React.FC;
  export default CommentsTab;
}

declare module '@/components/admin/tabs/ModerationTab' {
  const ModerationTab: React.FC;
  export default ModerationTab;
}

declare module '@/components/admin/tabs/UsersTab' {
  const UsersTab: React.FC;
  export default UsersTab;
}

declare module '@/components/admin/forms/ArticleForm' {
  interface ArticleFormData {
    title: string;
    content: string;
    starId: number;
    status: 'Draft' | 'Published' | 'Scheduled';
    publishDate: string;
    featuredImage?: string;
    excerpt: string;
    metaTitle: string;
    metaDescription: string;
  }

  interface ArticleFormProps {
    initialData?: ArticleFormData;
    onSubmit: (data: ArticleFormData) => void;
    onCancel: () => void;
    isEdit?: boolean;
  }

  const ArticleForm: React.FC<ArticleFormProps>;
  export default ArticleForm;
} 