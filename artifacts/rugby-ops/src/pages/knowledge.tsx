import React, { useState } from 'react';
import { useAppState } from '@/lib/app-state';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Badge, Textarea, Label } from '@/components/ui/core';
import { Search, Plus, Tag } from 'lucide-react';

export default function Knowledge() {
  const { knowledge, users, currentUser, addKnowledge } = useAppState();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tagsStr, setTagsStr] = useState('');

  const filteredDocs = knowledge.filter(k => 
    k.title.includes(searchTerm) || 
    k.tags.some(t => t.includes(searchTerm)) ||
    k.body.includes(searchTerm)
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !body) return;
    
    addKnowledge({
      title,
      body,
      tags: tagsStr.split(',').map(t => t.trim()).filter(Boolean)
    });
    
    setIsCreating(false);
    setTitle('');
    setBody('');
    setTagsStr('');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">ナレッジ共有</h1>
          <p className="text-muted-foreground mt-1">マニュアル・運用手順・過去のノウハウ</p>
        </div>
        <Button onClick={() => setIsCreating(!isCreating)}>
          {isCreating ? 'キャンセル' : <><Plus className="w-4 h-4 mr-2" />ドキュメント作成</>}
        </Button>
      </div>

      {isCreating && (
        <Card className="border-primary">
          <CardHeader className="bg-primary/5 border-b pb-4">
            <CardTitle className="text-lg">新規ドキュメント作成</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label>タイトル</Label>
                <Input value={title} onChange={e => setTitle(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>タグ（カンマ区切り）</Label>
                <Input value={tagsStr} onChange={e => setTagsStr(e.target.value)} placeholder="マニュアル, 大会運営, 2024" />
              </div>
              <div className="space-y-2">
                <Label>本文</Label>
                <Textarea value={body} onChange={e => setBody(e.target.value)} className="min-h-[200px]" required />
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit">保存して公開</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <Input 
          placeholder="キーワードやタグで検索..." 
          className="pl-10 py-6 text-base bg-card shadow-sm"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-4">
        {filteredDocs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            見つかりませんでした。
          </div>
        ) : (
          filteredDocs.map(doc => (
            <Card key={doc.id} className="hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-2 flex-1">
                    <h3 className="text-xl font-bold text-foreground cursor-pointer hover:text-primary transition-colors">{doc.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      {doc.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs font-normal">
                          <Tag className="w-3 h-3 mr-1" />{tag}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-2 leading-relaxed">
                      {doc.body}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{users.find(u => u.id === doc.author)?.name}</span>
                  <span>が作成</span>
                  <span>•</span>
                  <span>最終更新: {new Date(doc.updatedAt).toLocaleDateString('ja-JP')}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
