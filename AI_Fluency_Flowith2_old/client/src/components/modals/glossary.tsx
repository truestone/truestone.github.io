import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { glossary } from "@/lib/course-data";

interface GlossaryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GlossaryModal({ open, onOpenChange }: GlossaryModalProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredGlossary = glossary.filter(
    (item) =>
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">AI 용어 사전</DialogTitle>
          <DialogDescription>
            AI 학습에 필요한 핵심 용어들을 쉽게 찾아볼 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="용어를 검색하세요..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {filteredGlossary.map((item, index) => (
              <Card key={index} className="border">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-primary mb-2">
                    {item.term}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.definition}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredGlossary.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">검색 결과가 없습니다.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
