/**
 * 数据可视化交互网站 - 事件处理函数
 * 负责处理用户交互和事件
 */

// 扩展ChartManager对象
Object.assign(ChartManager, {
    // 切换数据集
    toggleDataset: function() {
        const toggleBtn = document.getElementById('toggle-data');
        
        switch(this.currentType) {
            case 'bar':
                // 在单组和多组数据之间切换
                const isMultiBar = toggleBtn.dataset.multiBar === 'true';
                toggleBtn.dataset.multiBar = !isMultiBar;
                toggleBtn.textContent = isMultiBar ? '切换到多组数据' : '切换到单组数据';
                break;
            case 'pie':
                // 在饼图和环形图之间切换
                const isDonut = toggleBtn.dataset.donut === 'true';
                toggleBtn.dataset.donut = !isDonut;
                toggleBtn.textContent = isDonut ? '切换到环形图' : '切换到饼图';
                break;
            default:
                // 其他图表类型暂不支持切换数据集
                return;
        }
        
        // 重新创建图表
        this.createChart();
        this.updateDataTable();
    },
    
    // 下载图表为图片
    downloadChart: function() {
        const canvas = document.getElementById('chart');
        const link = document.createElement('a');
        link.download = `${document.getElementById('chart-title').textContent}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    },
    
    // 应用图表选项
    applyOptions: function() {
        // 获取选项值
        const showLegend = document.getElementById('show-legend').checked;
        const showGrid = document.getElementById('show-grid').checked;
        const showDataLabels = document.getElementById('show-data-labels').checked;
        const animationSpeed = parseInt(document.getElementById('animation-speed').value);
        const colorScheme = document.getElementById('color-scheme').value;
        
        // 更新配置
        this.config.plugins.legend.display = showLegend;
        this.config.animation.duration = animationSpeed;
        
        // 应用颜色方案
        this.applyColorScheme(colorScheme);
        
        // 重新创建图表以应用更改
        this.createChart();
    },
    
    // 应用颜色方案
    applyColorScheme: function(scheme) {
        // 定义不同的颜色方案
        const colorSchemes = {
            default: {
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                    'rgba(199, 199, 199, 0.6)',
                    'rgba(83, 102, 255, 0.6)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(199, 199, 199, 1)',
                    'rgba(83, 102, 255, 1)'
                ]
            },
            pastel: {
                backgroundColor: [
                    'rgba(187, 222, 251, 0.6)',
                    'rgba(209, 196, 233, 0.6)',
                    'rgba(255, 224, 178, 0.6)',
                    'rgba(200, 230, 201, 0.6)',
                    'rgba(255, 205, 210, 0.6)',
                    'rgba(225, 190, 231, 0.6)',
                    'rgba(255, 236, 179, 0.6)',
                    'rgba(178, 235, 242, 0.6)'
                ],
                borderColor: [
                    'rgba(187, 222, 251, 1)',
                    'rgba(209, 196, 233, 1)',
                    'rgba(255, 224, 178, 1)',
                    'rgba(200, 230, 201, 1)',
                    'rgba(255, 205, 210, 1)',
                    'rgba(225, 190, 231, 1)',
                    'rgba(255, 236, 179, 1)',
                    'rgba(178, 235, 242, 1)'
                ]
            },
            vibrant: {
                backgroundColor: [
                    'rgba(244, 67, 54, 0.6)',
                    'rgba(33, 150, 243, 0.6)',
                    'rgba(255, 193, 7, 0.6)',
                    'rgba(0, 150, 136, 0.6)',
                    'rgba(156, 39, 176, 0.6)',
                    'rgba(255, 87, 34, 0.6)',
                    'rgba(76, 175, 80, 0.6)',
                    'rgba(63, 81, 181, 0.6)'
                ],
                borderColor: [
                    'rgba(244, 67, 54, 1)',
                    'rgba(33, 150, 243, 1)',
                    'rgba(255, 193, 7, 1)',
                    'rgba(0, 150, 136, 1)',
                    'rgba(156, 39, 176, 1)',
                    'rgba(255, 87, 34, 1)',
                    'rgba(76, 175, 80, 1)',
                    'rgba(63, 81, 181, 1)'
                ]
            },
            monochrome: {
                backgroundColor: [
                    'rgba(33, 33, 33, 0.9)',
                    'rgba(66, 66, 66, 0.8)',
                    'rgba(97, 97, 97, 0.7)',
                    'rgba(117, 117, 117, 0.6)',
                    'rgba(158, 158, 158, 0.5)',
                    'rgba(189, 189, 189, 0.4)',
                    'rgba(224, 224, 224, 0.3)',
                    'rgba(238, 238, 238, 0.2)'
                ],
                borderColor: [
                    'rgba(33, 33, 33, 1)',
                    'rgba(66, 66, 66, 1)',
                    'rgba(97, 97, 97, 1)',
                    'rgba(117, 117, 117, 1)',
                    'rgba(158, 158, 158, 1)',
                    'rgba(189, 189, 189, 1)',
                    'rgba(224, 224, 224, 1)',
                    'rgba(238, 238, 238, 1)'
                ]
            }
        };
        
        // 获取选择的颜色方案
        const selectedScheme = colorSchemes[scheme] || colorSchemes.default;
        
        // 应用到所有数据集
        Object.keys(chartData).forEach(chartType => {
            const data = chartData[chartType];
            
            if (data.datasets) {
                data.datasets.forEach((dataset, index) => {
                    if (dataset.backgroundColor && !Array.isArray(dataset.backgroundColor)) {
                        dataset.backgroundColor = selectedScheme.backgroundColor[index % selectedScheme.backgroundColor.length];
                    }
                    if (dataset.borderColor && !Array.isArray(dataset.borderColor)) {
                        dataset.borderColor = selectedScheme.borderColor[index % selectedScheme.borderColor.length];
                    }
                });
            }
        });
    },
    
    // 编辑数据
    editData: function() {
        // 启用编辑模式
        document.getElementById('data-panel').classList.add('edit-mode');
        
        // 使表格单元格可编辑
        const cells = document.querySelectorAll('#data-table tbody td:not(:first-child)');
        cells.forEach(cell => {
            cell.contentEditable = true;
            cell.classList.add('editable');
        });
        
        // 启用应用更改按钮
        document.getElementById('apply-changes').disabled = false;
    },
    
    // 应用数据更改
    applyDataChanges: function() {
        // 根据当前图表类型，从表格中获取数据并更新
        switch(this.currentType) {
            case 'line':
                this.applyLineChartChanges();
                break;
            case 'bar':
                this.applyBarChartChanges();
                break;
            case 'horizontalBar':
                this.applyHorizontalBarChartChanges();
                break;
            case 'area':
                this.applyAreaChartChanges();
                break;
            case 'pie':
                this.applyPieChartChanges();
                break;
            case 'scatter':
                this.applyScatterChartChanges();
                break;
            case 'radar':
                this.applyRadarChartChanges();
                break;
            case 'errorBar':
                this.applyErrorBarChartChanges();
                break;
        }
        
        // 重新创建图表
        this.createChart();
        
        // 禁用编辑模式
        document.getElementById('data-panel').classList.remove('edit-mode');
        
        // 使表格单元格不可编辑
        const cells = document.querySelectorAll('#data-table tbody td');
        cells.forEach(cell => {
            cell.contentEditable = false;
            cell.classList.remove('editable');
        });
        
        // 禁用应用更改按钮
        document.getElementById('apply-changes').disabled = true;
    },
    
    // 重置数据
    resetData: function() {
        // 从原始数据恢复
        Object.keys(originalChartData).forEach(key => {
            chartData[key] = JSON.parse(JSON.stringify(originalChartData[key]));
        });
        
        // 重新创建图表
        this.createChart();
        this.updateDataTable();
        
        // 禁用编辑模式
        document.getElementById('data-panel').classList.remove('edit-mode');
        
        // 使表格单元格不可编辑
        const cells = document.querySelectorAll('#data-table tbody td');
        cells.forEach(cell => {
            cell.contentEditable = false;
            cell.classList.remove('editable');
        });
        
        // 禁用应用更改按钮
        document.getElementById('apply-changes').disabled = true;
    },
    
    // 应用折线图数据更改
    applyLineChartChanges: function() {
        const rows = document.querySelectorAll('#data-table tbody tr');
        rows.forEach((row, index) => {
            const cells = row.querySelectorAll('td');
            chartData.line.datasets[0].data[index] = parseFloat(cells[1].textContent);
            chartData.line.datasets[1].data[index] = parseFloat(cells[2].textContent);
        });
    },
    
    // 应用柱形图数据更改
    applyBarChartChanges: function() {
        const rows = document.querySelectorAll('#data-table tbody tr');
        const isMultiBar = document.getElementById('toggle-data').dataset.multiBar === 'true';
        const data = isMultiBar ? chartData.multiBar : chartData.bar;
        
        rows.forEach((row, index) => {
            const cells = row.querySelectorAll('td');
            data.datasets[0].data[index] = parseFloat(cells[1].textContent);
            if (isMultiBar && cells[2]) {
                data.datasets[1].data[index] = parseFloat(cells[2].textContent);
            }
        });
    },
    
    // 应用条形图数据更改
    applyHorizontalBarChartChanges: function() {
        const rows = document.querySelectorAll('#data-table tbody tr');
        rows.forEach((row, index) => {
            const cells = row.querySelectorAll('td');
            chartData.horizontalBar.datasets[0].data[index] = parseFloat(cells[1].textContent);
        });
    },
    
    // 应用堆积面积图数据更改
    applyAreaChartChanges: function() {
        const rows = document.querySelectorAll('#data-table tbody tr');
        rows.forEach((row, index) => {
            const cells = row.querySelectorAll('td');
            chartData.area.datasets[0].data[index] = parseFloat(cells[1].textContent);
            chartData.area.datasets[1].data[index] = parseFloat(cells[2].textContent);
            chartData.area.datasets[2].data[index] = parseFloat(cells[3].textContent);
        });
    },
    
    // 应用饼图数据更改
    applyPieChartChanges: function() {
        const rows = document.querySelectorAll('#data-table tbody tr');
        rows.forEach((row, index) => {
            const cells = row.querySelectorAll('td');
            chartData.pie.datasets[0].data[index] = parseFloat(cells[1].textContent);
        });
    },
    
    // 应用散点图数据更改
    applyScatterChartChanges: function() {
        const rows = document.querySelectorAll('#data-table tbody tr');
        rows.forEach((row, index) => {
            const cells = row.querySelectorAll('td');
            chartData.scatter.datasets[0].data[index].x = parseFloat(cells[0].textContent);
            chartData.scatter.datasets[0].data[index].y = parseFloat(cells[1].textContent);
        });
    },
    
    // 应用雷达图数据更改
    applyRadarChartChanges: function() {
        const rows = document.querySelectorAll('#data-table tbody tr');
        rows.forEach((row, index) => {
            const cells = row.querySelectorAll('td');
            chartData.radar.datasets[0].data[index] = parseFloat(cells[1].textContent);
            chartData.radar.datasets[1].data[index] = parseFloat(cells[2].textContent);
            chartData.radar.datasets[2].data[index] = parseFloat(cells[3].textContent);
        });
    },
    
    // 应用误差棒图数据更改
    applyErrorBarChartChanges: function() {
        const rows = document.querySelectorAll('#data-table tbody tr');
        rows.forEach((row, index) => {
            const cells = row.querySelectorAll('td');
            
            // 更新数据值
            chartData.errorBar.datasets[0].data[index] = parseFloat(cells[1].textContent);
            chartData.errorBar.datasets[1].data[index] = parseFloat(cells[3].textContent);
            chartData.errorBar.datasets[2].data[index] = parseFloat(cells[5].textContent);
            chartData.errorBar.datasets[3].data[index] = parseFloat(cells[7].textContent);
            
            // 更新误差值（去掉±符号）
            chartData.errorBar.datasets[0].errors[index] = parseFloat(cells[2].textContent.replace('±', ''));
            chartData.errorBar.datasets[1].errors[index] = parseFloat(cells[4].textContent.replace('±', ''));
            chartData.errorBar.datasets[2].errors[index] = parseFloat(cells[6].textContent.replace('±', ''));
            chartData.errorBar.datasets[3].errors[index] = parseFloat(cells[8].textContent.replace('±', ''));
        });
    }
});