import { Component } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { RestService } from 'src/app/services/rest.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent {
  inventoryList: any = [];
  equipmentList: any = [];
  equipmentCategoryList: any = [];
  equipmentSubCategoryList: any = [];
  brandList: any = [];
  inv_id = 0;
  equipmentCategory = "" as any;
  equipmentSubCategory = "" as any;
  company = "";
  modelName = "";
  invPrice = "" as any;
  rentout = "" as any;
  totalInventory = 0;
  invlimit: number = 10;
  invoffset: number = 0;
  totalEquipment = 0;
  equipmentlimit: number = 10;
  equipmentoffset: number = 0;
  userType = "" as any;
  pageList = this.common.pageList;
  constructor(private rest: RestService, private router: Router, private location: Location, private common: CommonService, private activateRoute: ActivatedRoute) {
    this.userType = localStorage.getItem('slUserType');
  }

  ngOnInit() {
    if (localStorage.getItem('slUserId')) {
      this.getInventoryList();
      this.getEquipmentList();
      this.getAllEquipmentCategory();
      this.getAllBrandList();
    } else {
      this.router.navigate(['/']);
    }
  }
  subCategoryName(equ_cate_id: any) {
    const data = {
      equ_cate_id: equ_cate_id
    };
    this.rest.getEquipmentSubCategoryList(data).subscribe((res: any) => {
      if (res.success) {
        this.equipmentSubCategoryList = [];
        this.equipmentSubCategoryList = res.response;
      }
    })
  }

  inventorysubmit() {
    if (this.equipmentCategory == "" || this.equipmentCategory == null || this.equipmentCategory == undefined) {
      this.common.showAlertMessage("Please select equipment category", this.common.errContent);
      return;
    }
    if (this.equipmentSubCategory == "" || this.equipmentSubCategory == null || this.equipmentSubCategory == undefined) {
      this.common.showAlertMessage("Please enter equipment sub category", this.common.errContent);
      return;
    }
    if (this.company == "" || this.company == null || this.company == undefined) {
      this.common.showAlertMessage("Please enter brand name", this.common.errContent);
      return;
    }
    // if (this.modelName == "" || this.modelName == null || this.modelName == undefined) {
    //   this.common.showAlertMessage("Please enter model no", this.common.errContent);
    //   return;
    // }
    if (this.rentout == "" || this.rentout == null || this.rentout == undefined) {
      this.common.showAlertMessage("Please select rental option", this.common.errContent);
      return;
    }

    const brandName = this.getBrandNameById(this.company, this.brandList);
    const categoryName = this.getEquipmentCategoryById(this.equipmentCategory, this.equipmentCategoryList);
    let brandCode = brandName.substr(0, 3);
    //let categoryCode = categoryName.substr(0, 3);
    //console.log("categoryCode>>>>>>>>",categoryCode);
    let inv_code = '/' + categoryName + '/' + brandCode + '/' + this.modelName;
    const data = {
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType'),
      inv_id: this.inv_id,
      inv_code: inv_code,
      equ_cate_id: this.equipmentCategory,
      equ_sub_cate: this.equipmentSubCategory,
      company: this.company,
      modelName: this.modelName,
      invPrice: this.invPrice ? this.invPrice : 0,
      rentout: this.rentout
    };
    this.rest.inventorysubmit(data).subscribe((res: any) => {
      if (res.success) {
        this.common.inventorySubject.next(1);
        this.getInventoryList();
        this.getEquipmentList();
        this.equipmentCategory = "";
        this.equipmentSubCategory = "";
        this.company = "";
        this.modelName = "";
        this.invPrice = "";
        this.rentout = "";
        this.common.showAlertMessage(res.message, this.common.succContent);
      } else {
        this.common.showAlertMessage(res.message, this.common.errContent);
      }
    })
  }
  getAllBrandList() {
    this.rest.getAllBrand().subscribe((res: any) => {
      if (res.success) {
        this.brandList = [];
        this.brandList = res.response;
      }
    })
  }
  getInventoryList() {
    const data = {
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType'),
      limit: this.invlimit,
      offset: this.invoffset
    };
    this.rest.getInventoryList(data).subscribe((res: any) => {
      if (res.success) {
        this.inventoryList = [];
        this.inventoryList = res.response;
        this.totalInventory = res.totalCount;
      }
    })
  }
  getEquipmentList() {
    const data = {
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType'),
      limit: this.equipmentlimit,
      offset: this.equipmentoffset
    };
    this.rest.getEquipmentList(data).subscribe((res: any) => {
      if (res.success) {
        this.equipmentList = [];
        this.equipmentList = res.response;
        this.totalEquipment = res.totalCount;
      }
    })
  }
  getAllEquipmentCategory() {
    this.rest.getAllEquipmentCategory().subscribe((res: any) => {
      if (res.success) {
        this.equipmentCategoryList = res.response;
      }
    })
  }

  getEquipmentCategoryById(equ_cate_id: any, equipmentArray: any) {
    const foundCategory = equipmentArray.find((equCategory: any) => equCategory.equ_cate_id == equ_cate_id);
    return foundCategory ? foundCategory.equ_categoryName : null;
  }

  getBrandNameById(brandId: any, brandsArray: any) {
    const foundBrand = brandsArray.find((brand: any) => brand.brand_id == brandId);
    return foundBrand ? foundBrand.brand_name : null;
  }

  editInventary(inv_id: any, equ_cate_id: any, equ_sub_cate: any, company: any, modelName: any, invPrice: any, rentout: any) {
    this.inv_id = inv_id;
    this.equipmentCategory = equ_cate_id;
    this.equipmentSubCategory = equ_sub_cate;
    this.subCategoryName(this.equipmentCategory.toString());
    this.company = company;
    this.modelName = modelName;
    this.invPrice = invPrice > 0 ? invPrice : "";
    this.rentout = rentout;
  }

  removeInv(inv_id: any) {
    this.inv_id = inv_id;
  }

  deleteInventary() {
    const data = {
      id: this.inv_id,
      table_name: "inventary",
      table_pId: "inv_id",
      userId: localStorage.getItem('slUserId')
    };
    this.rest.delete(data).subscribe((res: any) => {
      if (res.success) {
        this.common.inventorySubject.next(1);
        this.inv_id = 0;
        this.common.showAlertMessage(res.message, this.common.succContent);
        this.getInventoryList();
        this.getEquipmentList();
      } else {
        this.common.showAlertMessage(res.message, this.common.errContent);
      }
    })
  }

  //-------------------- previous--------------//

  changePageLimitInv(event: any) {
    this.invlimit = Number(event.target.value);
    this.getInventoryList();
  }

  changePageLimitEquipment(event: any) {
    this.equipmentlimit = Number(event.target.value);
    this.getEquipmentList();
  }
  invNext() {
    var middleX = window.innerWidth / 2;
    var middleY = window.innerHeight / 2;
    window.scrollTo(middleX, middleY);
    this.invoffset = this.invoffset + this.invlimit;
    this.getInventoryList();
  }
  invPrevious() {
    this.invoffset = this.invoffset > 0 ? this.invoffset - this.invlimit : 0;
    this.getInventoryList();
  }

  equipNext() {
    var middleX = window.innerWidth / 2;
    var middleY = window.innerHeight / 2;
    window.scrollTo(middleX, middleY);
    this.equipmentoffset = this.equipmentoffset + this.equipmentlimit;
    this.getEquipmentList();
  }
  equipPrevious() {
    this.equipmentoffset = this.equipmentoffset > 0 ? this.equipmentoffset - this.equipmentlimit : 0;
    this.getEquipmentList();
  }
}
