import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../ui/Card";
import { Input } from "../../ui/Input";
import { Truck, Check, Settings } from "lucide-react";
import { Site, ShippingMethod, availableShippingMethods } from "../../../data";

interface ShippingTabProps {
  site: Site;
  onSiteChange: (site: Site) => void;
  onMarkChanged: () => void;
}

export const ShippingTab: React.FC<ShippingTabProps> = ({
  site,
  onSiteChange,
  onMarkChanged,
}) => {
  const toggleShippingMethod = (method: ShippingMethod) => {
    const exists = site.shippingMethods.find((m) => m.id === method.id);
    if (exists) {
      onSiteChange({
        ...site,
        shippingMethods: site.shippingMethods.filter((m) => m.id !== method.id),
      });
    } else {
      onSiteChange({
        ...site,
        shippingMethods: [...site.shippingMethods, { ...method }],
      });
    }
    onMarkChanged();
  };

  const handleShippingConfigChange = (
    field: "freeShippingThreshold" | "defaultShippingFee",
    value: string
  ) => {
    const numValue = value === "" ? undefined : parseFloat(value);
    onSiteChange({
      ...site,
      shippingConfig: {
        ...site.shippingConfig,
        [field]:
          numValue !== undefined && !isNaN(numValue) ? numValue : undefined,
      },
    });
    onMarkChanged();
  };

  const shippingConfig = site.shippingConfig || {};
  const currencySymbol = site.currency.symbol;

  return (
    <div className="space-y-6">
      {/* 运费配置 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            运费配置
          </CardTitle>
          <CardDescription>设置站点的运费规则</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-w-lg">
            <div className="space-y-2">
              <label className="text-sm font-medium">满多少免运费</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="0"
                  value={shippingConfig.freeShippingThreshold ?? ""}
                  onChange={(e) =>
                    handleShippingConfigChange(
                      "freeShippingThreshold",
                      e.target.value
                    )
                  }
                  min="0"
                  step="0.01"
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  {currencySymbol} 免运费
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                订单金额达到此金额时，将免收运费（留空表示不设置免运费门槛）
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">默认运费</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="0"
                  value={shippingConfig.defaultShippingFee ?? ""}
                  onChange={(e) =>
                    handleShippingConfigChange(
                      "defaultShippingFee",
                      e.target.value
                    )
                  }
                  min="0"
                  step="0.01"
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  {currencySymbol}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                未达到免运费门槛时的默认运费金额
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 配送方式 */}
      <Card>
        <CardHeader>
          <CardTitle>配送方式</CardTitle>
          <CardDescription>选择此站点支持的配送方式</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 max-w-lg">
            {availableShippingMethods.map((method) => {
              const isSelected = site.shippingMethods.some(
                (m) => m.id === method.id
              );
              return (
                <div
                  key={method.id}
                  onClick={() => toggleShippingMethod(method)}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Truck
                      className={`h-5 w-5 ${
                        isSelected ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                    <div>
                      <span className="font-medium">{method.name}</span>
                      <p className="text-xs text-muted-foreground">
                        {method.description}
                      </p>
                    </div>
                  </div>
                  {isSelected && <Check className="h-5 w-5 text-primary" />}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
