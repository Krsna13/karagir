import re

file_path = 'src/data/itemMaterialsDatabase.ts'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

items = {
    'item-1-sofa': '''      materials: [
        { role: 'Frame', rateKey: 'sagwan_teak', quantityBasis: 'volume_cuft', quantityFactor: 0.18, removable: true },
        { role: 'Frame', rateKey: 'bwr_ply', quantityBasis: 'surface_area_sqft', quantityFactor: 0.60, removable: true },
        { role: 'Cushioning', rateKey: 'foam_40d', quantityBasis: 'surface_area_sqft', quantityFactor: 0.60, removable: true },
        { role: 'Upholstery', rateKey: 'velvet_linen', quantityBasis: 'surface_area_sqft', quantityFactor: 0.60, removable: true, defaultSelected: true },
        { role: 'Upholstery', rateKey: 'leather', quantityBasis: 'surface_area_sqft', quantityFactor: 0.60, removable: true, defaultSelected: false }
      ]''',
    'item-2-dining-table': '''      materials: [
        { role: 'Frame & Legs', rateKey: 'sagwan_teak', quantityBasis: 'volume_cuft', quantityFactor: 0.18, removable: true },
        { role: 'Top', rateKey: 'makrana_marble', quantityBasis: 'top_area_sqft', quantityFactor: 1.0, removable: true, defaultSelected: false },
        { role: 'Top', rateKey: 'toughened_glass', quantityBasis: 'top_area_sqft', quantityFactor: 1.0, removable: true, defaultSelected: true },
        { role: 'Finish', rateKey: 'pu_polish', quantityBasis: 'surface_area_sqft', quantityFactor: 0.60, removable: true }
      ]''',
    'item-3-study-table': '''      materials: [
        { role: 'Structure', rateKey: 'bwr_ply', quantityBasis: 'volume_cuft', quantityFactor: 0.18, removable: true },
        { role: 'Surface', rateKey: 'laminate_1mm', quantityBasis: 'surface_area_sqft', quantityFactor: 0.60, removable: true },
        { role: 'Legs', rateKey: 'wrought_iron', quantityBasis: 'fixed_qty', quantityFactor: 1, removable: true },
        { role: 'Hardware', rateKey: 'drawer_runners', quantityBasis: 'fixed_qty', quantityFactor: 2, removable: true }
      ]''',
    'item-4-bed': '''      materials: [
        { role: 'Frame', rateKey: 'sheesham', quantityBasis: 'volume_cuft', quantityFactor: 0.18, removable: true },
        { role: 'Base & Storage', rateKey: 'marine_bwp_ply', quantityBasis: 'surface_area_sqft', quantityFactor: 0.60, removable: true },
        { role: 'Headboard', rateKey: 'pu_leatherette', quantityBasis: 'surface_area_sqft', quantityFactor: 0.30, removable: true },
        { role: 'Hardware', rateKey: 'gas_lift_struts', quantityBasis: 'fixed_qty', quantityFactor: 1, removable: true }
      ]''',
    'item-5-wardrobe': '''      materials: [
        { role: 'Carcass', rateKey: 'bwr_ply', quantityBasis: 'surface_area_sqft', quantityFactor: 0.60, removable: true },
        { role: 'Shutters', rateKey: 'acrylic_hg_laminate', quantityBasis: 'surface_area_sqft', quantityFactor: 0.40, removable: true },
        { role: 'Hardware', rateKey: 'concealed_hinges', quantityBasis: 'fixed_qty', quantityFactor: 6, removable: true }
      ]''',
    'item-6-coffee-table': '''      materials: [
        { role: 'Base', rateKey: 'cast_brass', quantityBasis: 'fixed_qty', quantityFactor: 1, removable: true },
        { role: 'Frame', rateKey: 'mango_wood', quantityBasis: 'volume_cuft', quantityFactor: 0.18, removable: true },
        { role: 'Top', rateKey: 'toughened_glass', quantityBasis: 'top_area_sqft', quantityFactor: 1.0, removable: true }
      ]''',
    'item-7-chair': '''      materials: [
        { role: 'Frame', rateKey: 'sagwan_teak', quantityBasis: 'volume_cuft', quantityFactor: 0.18, removable: true },
        { role: 'Backrest', rateKey: 'cane_webbing', quantityBasis: 'surface_area_sqft', quantityFactor: 0.20, removable: true },
        { role: 'Upholstery', rateKey: 'cotton_linen', quantityBasis: 'surface_area_sqft', quantityFactor: 0.30, removable: true }
      ]''',
    'item-8-bookshelf': '''      materials: [
        { role: 'Frame', rateKey: 'sheesham', quantityBasis: 'volume_cuft', quantityFactor: 0.18, removable: true },
        { role: 'Shelves', rateKey: 'veneer_ply', quantityBasis: 'surface_area_sqft', quantityFactor: 0.60, removable: true },
        { role: 'Finish', rateKey: 'beeswax_oil', quantityBasis: 'surface_area_sqft', quantityFactor: 0.60, removable: true }
      ]''',
    'item-9-dressing-table': '''      materials: [
        { role: 'Structure', rateKey: 'bwr_ply', quantityBasis: 'volume_cuft', quantityFactor: 0.18, removable: true },
        { role: 'Mirror', rateKey: 'mirror_glass', quantityBasis: 'top_area_sqft', quantityFactor: 1.0, removable: true },
        { role: 'Finish', rateKey: 'duco_paint', quantityBasis: 'surface_area_sqft', quantityFactor: 0.60, removable: true }
      ]''',
    'item-10-shoe-rack': '''      materials: [
        { role: 'Carcass', rateKey: 'bwr_ply', quantityBasis: 'surface_area_sqft', quantityFactor: 0.60, removable: true },
        { role: 'Doors', rateKey: 'louvered_slats', quantityBasis: 'surface_area_sqft', quantityFactor: 0.40, removable: true },
        { role: 'Hardware', rateKey: 'tray_mechanism', quantityBasis: 'fixed_qty', quantityFactor: 2, removable: true }
      ]''',
    'item-11-tv-unit': '''      materials: [
        { role: 'Structure', rateKey: 'hdmr_mdf', quantityBasis: 'surface_area_sqft', quantityFactor: 0.60, removable: true },
        { role: 'Panels', rateKey: 'fluted_panels', quantityBasis: 'surface_area_sqft', quantityFactor: 0.40, removable: true },
        { role: 'Countertop', rateKey: 'italian_marble', quantityBasis: 'top_area_sqft', quantityFactor: 1.0, removable: true }
      ]''',
    'item-12-side-table': '''      materials: [
        { role: 'Legs', rateKey: 'cast_brass', quantityBasis: 'fixed_qty', quantityFactor: 1, removable: true },
        { role: 'Top', rateKey: 'mango_wood', quantityBasis: 'top_area_sqft', quantityFactor: 1.0, removable: true }
      ]''',
    'item-13-home-temple': '''      materials: [
        { role: 'Main Structure', rateKey: 'sagwan_teak', quantityBasis: 'volume_cuft', quantityFactor: 0.18, removable: true },
        { role: 'Accents', rateKey: 'cast_brass', quantityBasis: 'fixed_qty', quantityFactor: 1, removable: true },
        { role: 'Inlay', rateKey: 'makrana_marble', quantityBasis: 'top_area_sqft', quantityFactor: 1.0, removable: true }
      ]''',
    'item-14-wooden-bench': '''      materials: [
        { role: 'Plank', rateKey: 'sheesham', quantityBasis: 'top_area_sqft', quantityFactor: 1.0, removable: true },
        { role: 'Base', rateKey: 'wrought_iron', quantityBasis: 'fixed_qty', quantityFactor: 1, removable: true }
      ]''',
    'item-15-crockery-cabinet': '''      materials: [
        { role: 'Frame', rateKey: 'sagwan_teak', quantityBasis: 'volume_cuft', quantityFactor: 0.18, removable: true },
        { role: 'Glass Doors', rateKey: 'reeded_glass', quantityBasis: 'surface_area_sqft', quantityFactor: 0.40, removable: true }
      ]''',
    'item-16-indoor-swing': '''      materials: [
        { role: 'Plank', rateKey: 'sagwan_teak', quantityBasis: 'top_area_sqft', quantityFactor: 1.0, removable: true },
        { role: 'Hanging Chains', rateKey: 'cast_brass', quantityBasis: 'fixed_qty', quantityFactor: 4, removable: true }
      ]''',
    'item-17-chest-drawers': '''      materials: [
        { role: 'Body', rateKey: 'veneer_ply', quantityBasis: 'surface_area_sqft', quantityFactor: 0.60, removable: true },
        { role: 'Front Inlay', rateKey: 'mop_tile', quantityBasis: 'surface_area_sqft', quantityFactor: 0.20, removable: true }
      ]''',
    'item-18-bar-cabinet': '''      materials: [
        { role: 'Body', rateKey: 'mango_wood', quantityBasis: 'volume_cuft', quantityFactor: 0.18, removable: true },
        { role: 'Racks', rateKey: 'ss304', quantityBasis: 'fixed_qty', quantityFactor: 2, removable: true }
      ]''',
    'item-19-console-table': '''      materials: [
        { role: 'Frame', rateKey: 'ss304', quantityBasis: 'fixed_qty', quantityFactor: 1, removable: true },
        { role: 'Top', rateKey: 'italian_marble', quantityBasis: 'top_area_sqft', quantityFactor: 1.0, removable: true }
      ]''',
    'item-20-bedside-table': '''      materials: [
        { role: 'Body', rateKey: 'laminate_1mm', quantityBasis: 'surface_area_sqft', quantityFactor: 0.60, removable: true },
        { role: 'Drawers', rateKey: 'drawer_runners', quantityBasis: 'fixed_qty', quantityFactor: 2, removable: true }
      ]''',
    'item-21-door': '''      materials: [
        { role: 'Core & Frame', rateKey: 'sagwan_teak', quantityBasis: 'volume_cuft', quantityFactor: 0.18, removable: true },
        { role: 'Panel', rateKey: 'marine_bwp_ply', quantityBasis: 'surface_area_sqft', quantityFactor: 0.60, removable: true },
        { role: 'Finish', rateKey: 'pu_polish', quantityBasis: 'surface_area_sqft', quantityFactor: 0.60, removable: true },
        { role: 'Hardware', rateKey: 'door_hardware_set', quantityBasis: 'fixed_qty', quantityFactor: 1, removable: true }
      ]'''
}

new_content = content
for item_id, mat_block in items.items():
    match = re.search(r"id:\s*'" + item_id + r"'[\s\S]*?model3DType:\s*'([^']+)'", new_content)
    if match:
        old_str = match.group(0)
        new_str = old_str + ",\n" + mat_block
        new_content = new_content.replace(old_str, new_str)
    else:
        print(f"Match failed for {item_id}")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)
print("Updated successfully!")
