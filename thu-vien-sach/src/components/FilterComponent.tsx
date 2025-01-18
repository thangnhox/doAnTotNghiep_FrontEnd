
// FilterComponent
import { Button, Divider, Slider, Typography } from "antd";
import React from "react";
import { numbericFormat } from "../utils/numbericUtil";

interface Props {
    data: {
        filterData: {
            maxPrice: number;
            minPrice: number;
            maxPage: number;
            minPage: number;
        };
        selectPageRange: (value: number[]) => void;
        selectPriceRange: (value: number[]) => void;
        performFilter: () => void;
    };
}

const FilterComponent = ({ data }: Props) => {
    const { filterData, selectPageRange, selectPriceRange, performFilter } = data;

    return (
        <div className="d-flex flex-column gap-3" style={{ width: "400px" }}>
            <div className="d-flex flex-column gap-3">
                <Typography.Title level={5}>Giá</Typography.Title>
                <div className="d-flex flex-row gap-3 align-items-center">
                    <Typography.Text>{numbericFormat(filterData.minPrice)}</Typography.Text>
                    <Slider
                        range
                        min={0}
                        max={2500000}
                        defaultValue={[filterData.minPrice, filterData.maxPrice]}
                        onAfterChange={selectPriceRange}
                        tooltip={{
                            formatter(value) {
                                return numbericFormat(value as number);
                            },
                        }}
                        style={{ flex: 1 }}
                    />
                    <Typography.Text>{numbericFormat(filterData.maxPrice)}</Typography.Text>
                </div>
            </div>
            <div className="d-flex flex-column gap-3">
                <Typography.Title level={5}>Số trang</Typography.Title>
                <div className="d-flex flex-row gap-3 align-items-center">
                    <Typography.Text>{filterData.minPage}</Typography.Text>
                    <Slider
                        range
                        min={1}
                        max={1000}
                        defaultValue={[filterData.minPage, filterData.maxPage]}
                        onAfterChange={selectPageRange}
                        style={{ flex: 1 }}
                        tooltip={{
                            formatter(value) {
                                return numbericFormat(value as number);
                            },
                        }}
                    />
                    <Typography.Text>{filterData.maxPage}</Typography.Text>
                </div>
            </div>
            <Divider />
            <div className="d-flex flex-row justify-content-end">
                <Button type="primary" onClick={performFilter}>
                    Chọn
                </Button>
            </div>
        </div>
    );
};

export default FilterComponent;
